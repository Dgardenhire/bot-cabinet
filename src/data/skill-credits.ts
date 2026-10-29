/** Outside work a starter Bot's bundled Skill is based on, keyed by Bot slug. Shown on the Bot page. */
export type SkillCredit = {
  /** The Skill's name as the Bot Pack publishes it. */
  skill: string;
  /** The outside work's title. */
  work: string;
  href: string;
  /** Where the outside work is listed. */
  listedOn: string;
};

export const SKILL_CREDITS: Record<string, SkillCredit> = {
  ops: {
    skill: "Diagnose a bad AI result",
    work: "Diagnose My Agent’s Mistake",
    href: "https://museatwork.app/#w=1d0661a5-1cf7-4013-9aff-9cf605bcbe8c",
    listedOn: "Muse at Work",
  },
};

export function getSkillCredit(slug: string): SkillCredit | undefined {
  return SKILL_CREDITS[slug];
}
