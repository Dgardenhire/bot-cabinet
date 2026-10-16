import { STARTER_BOTS } from "../data/starter-bots";
import { CREW_KITS } from "../data/crew-kits";
import { SPECIALISTS, CREW_PLANS } from "../data/specialist-collection";
import { getBotRuntimeEvidence, getReproducedBotEvidence } from "../data/bot-release-evidence";

const origin = "https://botcabinet.com";

export function buildAgentResourceEntries() {
  return [
    ...STARTER_BOTS.map(bot => {
      const reproduced = getReproducedBotEvidence(bot.slug);
      const runtime = getBotRuntimeEvidence(bot.slug);
      return {
        id: `starter:${bot.slug}`, kind: "starter-bot", slug: bot.slug, name: bot.name,
        summary: bot.summary, detailUrl: `${origin}/bots/${bot.slug}/`, setup: "hermes-profile-or-manual-adaptation",
        files: [{ url: `${origin}/downloads/portable-bot-packs/v2/${bot.slug}.json`, mediaType: "application/json" }],
        testStatus: reproduced ? { level: "reproduced-bounded-task", testedAt: reproduced.testedDate, evidenceUrl: `${origin}/proof/${reproduced.proofSlug}/` }
          : runtime ? { level: "one-bounded-task", testedAt: runtime.testedDate, evidenceUrl: origin + runtime.proofPath }
          : { level: "no-comparable-exact-package-task-record", testedAt: null, evidenceUrl: null },
      };
    }),
    ...SPECIALISTS.map(bot => ({
      id: `specialist:${bot.slug}`, kind: "manual-specialist", slug: bot.slug, name: bot.name,
      summary: bot.summary, detailUrl: `${origin}/bots/${bot.slug}/`, setup: "manual-role-instructions",
      files: [{ url: `${origin}/downloads/specialists/${bot.slug}.md`, mediaType: "text/markdown" }],
      firstTask: bot.task, checklist: bot.checklist,
      testStatus: { level: "codex-text-exercise-not-native-app-tested", testedAt: bot.evidence?.date ?? null, evidenceUrl: `${origin}/bots/${bot.slug}/#check-answer` },
    })),
    ...CREW_KITS.map(crew => ({
      id: `crew-kit:${crew.slug}`, kind: "crew-kit", slug: crew.slug, name: crew.name,
      summary: crew.promise, detailUrl: `${origin}/crew-kits/${crew.slug}/`, setup: "separate-hermes-profiles-and-manual-handoffs",
      files: [{ url: `${origin}/downloads/crew-kits/bundles/${crew.slug}.zip`, mediaType: "application/zip" }],
      members: crew.roles.map(role => `starter:${role.botSlug}`),
      testStatus: { level: crew.slug === "publishing-desk" ? "latest-independent-repeat-failed" : "no-native-handoff-test-record", testedAt: null,
        evidenceUrl: crew.slug === "publishing-desk" ? `${origin}/proof/publishing-desk-failed-handoff/` : null },
    })),
    ...CREW_PLANS.map(crew => ({
      id: `crew-plan:${crew.slug}`, kind: "manual-crew-plan", slug: crew.slug, name: crew.name,
      summary: crew.summary, detailUrl: `${origin}/crew-kits/${crew.slug}/`, setup: "manual-role-setup-and-handoffs",
      files: [{ url: `${origin}/downloads/crew-plans/${crew.slug}.md`, mediaType: "text/markdown" }],
      members: crew.roles.map(role => `${SPECIALISTS.some(bot => bot.slug === role.slug) ? "specialist" : "starter"}:${role.slug}`),
      firstTask: crew.task, checklist: crew.checklist,
      testStatus: { level: "simulated-text-handoffs-not-native-app-tested", testedAt: crew.evidence?.date ?? null, evidenceUrl: `${origin}/crew-kits/${crew.slug}/` },
    })),
  ];
}

export const AGENT_RESOURCE_ENTRIES = buildAgentResourceEntries();
