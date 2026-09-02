import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  PROOF_NEXT_STEP_COPY,
  PROOF_PROMPT_EYEBROWS,
  PROOF_PROMPT_HEADINGS,
  PROOF_ROOM_DEMOS,
  PROOF_STATE_NAMES,
  getProofRoomDemo,
} from "./proof-room";

const publicRoot = path.join(process.cwd(), "public");

function checkState(demo: (typeof PROOF_ROOM_DEMOS)[number], label: "Role run" | "Reproduction") {
  return demo.checks.find((check) => check.label === label)?.state;
}

describe("Proof Room evidence records", () => {
  it("publishes the three approved demonstrations in order", () => {
    expect(PROOF_ROOM_DEMOS.map((demo) => demo.slug)).toEqual([
      "scout-research-brief",
      "writer-article-draft",
      "chief-of-staff-operating-brief",
    ]);
  });

  it("keeps designed and prepared tests from claiming a conversation or finished result", () => {
    for (const demo of PROOF_ROOM_DEMOS.filter((item) => item.state === "test-designed" || item.state === "test-prepared")) {
      expect(demo.conversationExcerpt).toBeUndefined();
      expect(demo.deliverable).toBeUndefined();
      expect(demo.run).toBeUndefined();
      expect(demo.recordedMedia).toBeUndefined();
      expect(demo.title.toLowerCase()).toContain("test");
      expect(demo.outcome.toLowerCase()).toContain("intended result after a preserved run");
      expect(checkState(demo, "Role run")).toBe("not-run");
      expect(checkState(demo, "Reproduction")).toBe("not-run");
      expect(demo.inputStatus).toBe(demo.state === "test-designed" ? "planned" : "supplied");
    }
  });

  it("requires a partial role record and pending reproduction for recorded excerpts", () => {
    for (const demo of PROOF_ROOM_DEMOS.filter((item) => item.state === "recorded-excerpt")) {
      expect(demo.conversationExcerpt?.length).toBeGreaterThan(0);
      expect(demo.recordedMedia?.href).toBeTruthy();
      expect(PROOF_PROMPT_EYEBROWS[demo.state]).toBe("Reproduction request");
      expect(PROOF_PROMPT_HEADINGS[demo.state].toLowerCase()).toContain("reproduction");
      expect(demo.run).toBeUndefined();
      expect(checkState(demo, "Role run")).toBe("partial");
      expect(checkState(demo, "Reproduction")).toBe("not-run");
    }
  });

  it("requires complete evidence before a demonstration can be reproduced", () => {
    for (const demo of PROOF_ROOM_DEMOS.filter((item) => item.state === "reproduced")) {
      expect(demo.conversationExcerpt?.length).toBeGreaterThan(1);
      expect(demo.deliverable?.href).toBeTruthy();
      expect(demo.run?.runAt).toBeTruthy();
      expect(demo.run?.model).toBeTruthy();
      expect(demo.run?.elapsedSeconds).toBeTypeOf("number");
      expect(demo.run?.costNote).toBeTruthy();
      expect(demo.inputStatus).toBe("supplied");
      expect(demo.transcript?.href).toBeTruthy();
      expect(demo.checks.slice(0, 4).every((check) => check.state === "passed")).toBe(true);
    }
  });

  it("discloses the incomplete Scout record and never uses a blanket verified label", () => {
    const scout = getProofRoomDemo("scout-research-brief");
    expect(scout?.state).toBe("recorded-excerpt");
    expect(scout?.evidenceNote.toLowerCase()).toContain("full run record");

    const serialized = JSON.stringify(PROOF_ROOM_DEMOS).toLowerCase();
    expect(serialized).not.toContain('"verified"');
    expect(serialized).not.toContain("fully verified");
  });

  it("records human decisions and separate evidence checks for every demo", () => {
    for (const demo of PROOF_ROOM_DEMOS) {
      expect(demo.platform).toBe("Hermes Agent");
      expect(demo.humanDecisions.length).toBeGreaterThan(0);
      expect(demo.profileVersion).toBeTruthy();
      expect(demo.passportVersion).toBeGreaterThan(0);
      expect(demo.checks.map((check) => check.label)).toEqual([
        "Package checks",
        "Profile import",
        "Role run",
        "Reproduction",
        "Human technical review",
      ]);
    }
  });

  it("derives public state and next-step language from the evidence state", () => {
    expect(Object.keys(PROOF_STATE_NAMES).sort()).toEqual(Object.keys(PROOF_PROMPT_HEADINGS).sort());
    expect(Object.keys(PROOF_STATE_NAMES).sort()).toEqual(Object.keys(PROOF_PROMPT_EYEBROWS).sort());
    expect(Object.keys(PROOF_STATE_NAMES).sort()).toEqual(Object.keys(PROOF_NEXT_STEP_COPY).sort());
    expect(PROOF_NEXT_STEP_COPY.reproduced.heading).toContain("Review the record");
    expect(PROOF_NEXT_STEP_COPY["test-designed"].heading).toContain("Supply the source material");
  });

  it("keeps every referenced local proof asset in the public tree", () => {
    for (const demo of PROOF_ROOM_DEMOS) {
      const paths = [
        demo.cardImage,
        demo.recordedMedia?.href,
        demo.recordedMedia?.poster,
        demo.transcript?.href,
        demo.deliverable?.href,
        ...demo.inputArtifacts.map((artifact) => artifact.href),
        ...demo.supportingArtifacts.map((artifact) => artifact.href),
      ].filter((href): href is string => Boolean(href?.startsWith("/")));

      for (const href of paths) {
        expect(existsSync(path.join(publicRoot, href.slice(1))), href).toBe(true);
      }
    }
  });
});
