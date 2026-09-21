import { describe, expect, it } from "vitest";

import { parseEditorialJson } from "./editorial-json";

describe("editorial JSON parser", () => {
  it("preserves strict JSON without transformation", () => {
    expect(parseEditorialJson('{"newsletter":"Draft"}')).toEqual({
      value: { newsletter: "Draft" },
      format: "strict-json",
      transformed: false,
    });
  });

  it("accepts one isolated JSON fence while recording the transformation", () => {
    expect(parseEditorialJson('```json\n{"newsletter":"Draft"}\n```')).toEqual({
      value: { newsletter: "Draft" },
      format: "single-json-fence",
      transformed: true,
    });
  });

  it.each([
    "Here is the result:\n```json\n{}\n```",
    "```\n{}\n```",
    "```json\n{}\n```\n```json\n{}\n```",
    "[]",
    "not json",
  ])("rejects commentary, unsupported fences, multiple objects and nonobjects", raw => {
    expect(() => parseEditorialJson(raw)).toThrow();
  });
});
