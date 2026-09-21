import assert from "node:assert/strict";
import test from "node:test";
import { runEditorialProcess } from "./editorial-process-limit.mjs";

test("captures normal completion and preserves failure exit codes", async () => {
  const result = await runEditorialProcess(process.execPath, ["-e", "console.log('evidence');process.exitCode=7"], { timeoutMs: 2000 });
  assert.equal(result.exitCode, 7);
  assert.equal(result.timedOut, false);
  assert.match(result.stdout, /evidence/);
});

test("interrupts an overlong test so its cleanup handler can run", async () => {
  const result = await runEditorialProcess(process.execPath, ["-e", "process.on('SIGINT',()=>{console.log('cleanup');process.exit(0)});setInterval(()=>{},100)"], { timeoutMs: 500, graceMs: 1000 });
  assert.equal(result.timedOut, true);
  assert.equal(result.forced, false);
  assert.match(result.stdout, /cleanup/);
  assert.ok(result.elapsedMs < 3000);
});

test("forcibly stops a test that ignores interruption", async () => {
  const result = await runEditorialProcess(process.execPath, ["-e", "process.on('SIGINT',()=>{});setInterval(()=>{},100)"], { timeoutMs: 500, graceMs: 100 });
  assert.equal(result.timedOut, true);
  assert.equal(result.forced, true);
  assert.equal(result.exitSignal, "SIGKILL");
  assert.ok(result.elapsedMs < 3000);
});

test("rejects missing or unbounded timeout before launching anything", () => {
  assert.throws(() => runEditorialProcess(process.execPath, [], {}), /timeout/);
  assert.throws(() => runEditorialProcess(process.execPath, [], { timeoutMs: 180001 }), /timeout/);
});
