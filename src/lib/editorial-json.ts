export type EditorialJsonFormat = "strict-json" | "single-json-fence";

export interface ParsedEditorialJson {
  value: Record<string, unknown>;
  format: EditorialJsonFormat;
  transformed: boolean;
}

function requireObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Editorial handoff must be one JSON object");
  }
  return value as Record<string, unknown>;
}

/** Parse one editorial handoff without repairing its data.
 * A single isolated ```json fence is tolerated and explicitly recorded.
 * Commentary, multiple fences and other wrappers remain hard failures.
 */
export function parseEditorialJson(raw: string): ParsedEditorialJson {
  try {
    return { value: requireObject(JSON.parse(raw)), format: "strict-json", transformed: false };
  } catch (strictError) {
    const match = raw.match(/^\s*```json\s*\n?([\s\S]*?)\n?```\s*$/i);
    if (!match) {
      throw new Error(`Editorial handoff is not strict JSON or one isolated JSON fence: ${strictError instanceof Error ? strictError.message : String(strictError)}`);
    }
    return { value: requireObject(JSON.parse(match[1])), format: "single-json-fence", transformed: true };
  }
}
