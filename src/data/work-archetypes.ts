/** Broad jobs, not more downloadable Bots. Membership is an editorial choice. */
export const WORK_ARCHETYPES = [
  { id: "researcher", name: "Researcher", job: "Find information and check what the evidence supports.", bots: ["scout", "researcher", "competitor-brief", "search-presence"] },
  { id: "writer", name: "Writer and editor", job: "Turn approved material into clear words, clips and visuals.", bots: ["writer", "editor", "story", "clip-planner", "visual-producer"] },
  { id: "coordinator", name: "Coordinator", job: "Organize decisions, plans and follow-ups.", bots: ["planner", "chief-of-staff", "reentry"] },
  { id: "builder", name: "Builder", job: "Design and build software or reusable Bot instructions.", bots: ["coder", "architect", "founding-engineer", "skill-builder", "bot-porter"] },
  { id: "reviewer", name: "Reviewer", job: "Check work, systems and spending against stated requirements.", bots: ["ops", "bug-examiner", "change-reviewer", "curator", "subscription-review", "ad-spend-review"] },
  { id: "teacher", name: "Teacher and coach", job: "Explain, practise and help someone improve.", bots: ["professor", "coach", "habit-coach"] },
  { id: "client", name: "Client and sales assistant", job: "Prepare client work, research prospects and review sales opportunities.", bots: ["client", "call-coach", "lead-qualifier", "outreach-coordinator", "pipeline-review", "deal-reviewer", "pitch-coach"] },
  { id: "experimenter", name: "Experimenter", job: "Test an idea or campaign before committing more time and money.", bots: ["nova", "pulse", "campaign-builder"] },
  { id: "personal", name: "Personal assistant", job: "Prepare the day ahead and help with household paperwork.", bots: ["daily-newspaper", "receipt"] },
] as const;

export type WorkArchetypeId = typeof WORK_ARCHETYPES[number]["id"];

export function matchesWorkArchetype(slug: string, id: WorkArchetypeId | "all") {
  return id === "all" || WORK_ARCHETYPES.some(group => group.id === id && group.bots.some(bot => bot === slug));
}
