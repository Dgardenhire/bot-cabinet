export function cleanInline(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function splitPlanningItems(value: string): string[] {
  const seen = new Set<string>();

  return value
    .replace(/\r\n?/g, "\n")
    .split(/\n+|;/)
    .map((item) => item.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function escapeMarkdown(value: string): string {
  return value.replace(/([\\`*_[\]<>#+!|])/g, "\\$1");
}
