import { spawn } from "node:child_process";

/** Local test-process guard. This does not cap provider billing or cancel remote work. */
export function runEditorialProcess(command, args, { timeoutMs, graceMs = 2000, cwd, env = process.env } = {}) {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 180000) {
    throw new Error("Editorial test timeout must be 1–180000 ms");
  }
  if (!Number.isInteger(graceMs) || graceMs < 1 || graceMs > 5000) throw new Error("Invalid shutdown grace");
  return new Promise((resolve, reject) => {
    const started = Date.now();
    // A separate process group ensures only this test and its descendants are signalled.
    const child = spawn(command, args, { cwd, env, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"] });
    let timedOut = false;
    let outputLimitExceeded = false;
    let forced = false;
    let stopping = false;
    let stdout = "";
    let stderr = "";
    let escalation;
    const signal = name => {
      try {
        if (process.platform === "win32") child.kill(name);
        else if (child.pid) process.kill(-child.pid, name);
      } catch (error) {
        if (error.code !== "ESRCH") throw error;
      }
    };
    const stop = () => {
      if (stopping) return;
      stopping = true;
      signal("SIGINT");
      escalation = setTimeout(() => { forced = true; signal("SIGKILL"); }, graceMs);
    };
    const timer = setTimeout(() => { timedOut = true; stop(); }, timeoutMs);
    const append = (current, chunk) => {
      const next = current + chunk.toString();
      if (Buffer.byteLength(next) > 262144) {
        outputLimitExceeded = true;
        stop();
        return current;
      }
      return next;
    };
    child.stdout.on("data", chunk => { stdout = append(stdout, chunk); });
    child.stderr.on("data", chunk => { stderr = append(stderr, chunk); });
    child.on("error", error => {
      clearTimeout(timer);
      clearTimeout(escalation);
      reject(error);
    });
    child.on("close", (exitCode, exitSignal) => {
      clearTimeout(timer);
      clearTimeout(escalation);
      // Also retire any child process that outlived the main test process.
      signal("SIGKILL");
      resolve({ exitCode, exitSignal, timedOut, outputLimitExceeded, forced, elapsedMs: Date.now() - started, stdout, stderr });
    });
  });
}
