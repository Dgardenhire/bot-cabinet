export type ProofState = "test-designed" | "test-prepared" | "recorded-excerpt" | "prompt-contract-recorded" | "reproduced";
export type ProofCheckState = "passed" | "partial" | "not-run" | "unavailable";

export const PROOF_STATE_NAMES: Record<ProofState, string> = {
  "test-designed": "Test designed",
  "test-prepared": "Test prepared",
  "recorded-excerpt": "Recorded excerpt",
  "prompt-contract-recorded": "Two prompt-contract runs recorded",
  reproduced: "Reproduced",
};

export const PROOF_PROMPT_HEADINGS: Record<ProofState, string> = {
  "test-designed": "The prompt designed for this test",
  "test-prepared": "The prompt prepared for this test",
  "recorded-excerpt": "The prompt prepared for a complete reproduction",
  "prompt-contract-recorded": "The request used for both recorded runs",
  reproduced: "The prompt used for this reproduced run",
};

export const PROOF_PROMPT_EYEBROWS: Record<ProofState, string> = {
  "test-designed": "Planned request",
  "test-prepared": "Prepared request",
  "recorded-excerpt": "Reproduction request",
  "prompt-contract-recorded": "Recorded request",
  reproduced: "Exact request",
};

export const PROOF_NEXT_STEP_COPY: Record<ProofState, { eyebrow: string; heading: string; body: string }> = {
  "test-designed": {
    eyebrow: "Next required work",
    heading: "Supply the source material, then complete the run",
    body: "Bot Cabinet will add a transcript, finished file, run date, model, elapsed time, cost note, and reproduction result only after they are preserved from a clean test environment.",
  },
  "test-prepared": {
    eyebrow: "Next required work",
    heading: "Complete the run before upgrading the label",
    body: "Bot Cabinet will add a transcript, finished file, run date, model, elapsed time, cost note, and reproduction result only after they are preserved from a clean test environment.",
  },
  "recorded-excerpt": {
    eyebrow: "Next required work",
    heading: "Reproduce the run and preserve the complete record",
    body: "Bot Cabinet will add a transcript, finished file, run date, model, elapsed time, cost note, and reproduction result only after they are preserved from a clean test environment.",
  },
  "prompt-contract-recorded": {
    eyebrow: "Next required work",
    heading: "Import the exact profile and complete a package reproduction",
    body: "These runs tested the disclosed role and request in Hermes Agent. Bot Cabinet still needs to import the exact downloadable profile and repeat the test before this demonstration can be labeled reproduced.",
  },
  reproduced: {
    eyebrow: "Preserved evidence",
    heading: "Review the record behind this result",
    body: "The disclosed transcript, finished file, run details, cost note, and reproduction checks form the record for this result.",
  },
};

export interface ProofArtifact {
  label: string;
  description: string;
  href?: string;
}

export interface ProofLinkedArtifact extends ProofArtifact {
  href: string;
  download?: boolean;
}

export interface ProofRecordedMedia extends ProofLinkedArtifact {
  poster: string;
  mimeType: "video/mp4";
  caption: string;
}

export interface ProofConversationTurn {
  role: "Person" | "Bot";
  text: string;
  abridged: boolean;
}

export interface ProofCheck {
  label: "Package checks" | "Profile import" | "Role run" | "Reproduction" | "Human technical review";
  state: ProofCheckState;
  detail: string;
  checkedAt?: string;
}

export interface ProofRun {
  runAt: string;
  hermesVersion?: string;
  provider?: string;
  model?: string;
  elapsedSeconds?: number;
  elapsedNote?: string;
  costUsd?: number;
  costNote: string;
}

export interface ProofRoomDemo {
  slug: string;
  botSlug: "scout" | "writer" | "chief-of-staff";
  cardImage: string;
  title: string;
  outcome: string;
  summary: string;
  state: ProofState;
  stateDetail: string;
  platform: "Hermes Agent";
  evidenceNote: string;
  inputStatus: "planned" | "supplied";
  fixtureDisclosure: string;
  inputArtifacts: ProofArtifact[];
  exactPrompt: string;
  conversationExcerpt?: ProofConversationTurn[];
  conversationDisclosure?: string;
  transcript?: ProofLinkedArtifact;
  deliverable?: ProofLinkedArtifact;
  recordedMedia?: ProofRecordedMedia;
  supportingArtifacts: ProofLinkedArtifact[];
  humanDecisions: string[];
  profileVersion: string;
  passportVersion: number;
  run?: ProofRun;
  checks: ProofCheck[];
}

const commonTechnicalReview: ProofCheck = {
  label: "Human technical review",
  state: "unavailable",
  detail: "A human technical review is a possible long-term goal. Bot Cabinet cannot offer one at this time.",
};

export const PROOF_ROOM_DEMOS: ProofRoomDemo[] = [
  {
    slug: "scout-research-brief",
    botSlug: "scout",
    cardImage: "/proof-room/thumbnails/scout.webp",
    title: "Scout prepares a first-user research brief",
    outcome: "A concise guide for a first-time Hermes user, shown in a recorded excerpt",
    summary: "The current video preserves part of a Scout conversation and result. A complete, reproducible run record is the next required test.",
    state: "recorded-excerpt",
    stateDetail: "full record incomplete",
    platform: "Hermes Agent",
    evidenceNote: "The video preserves an excerpt identified as a Scout response from Hermes Agent. The full run record—including the complete input, raw transcript, run date, model, elapsed time, cost, and finished output file—was not preserved. A new isolated run is required before this demonstration can be labeled reproduced.",
    inputStatus: "planned",
    fixtureDisclosure: "The prepared reproduction uses only the three official Hermes documentation pages listed below.",
    inputArtifacts: [
      {
        label: "Hermes profiles",
        description: "Official guide to separate profiles and their state.",
        href: "https://hermes-agent.nousresearch.com/docs/user-guide/profiles",
      },
      {
        label: "Profile distributions",
        description: "Official guide to portable profile packages and installation.",
        href: "https://hermes-agent.nousresearch.com/docs/user-guide/profile-distributions",
      },
      {
        label: "Bot Mode",
        description: "Official guide to named Bots and their roles inside Hermes.",
        href: "https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode",
      },
    ],
    exactPrompt: "Review only the three supplied official Hermes documentation pages. Prepare a concise brief for a first-time user explaining what a Hermes profile carries, how someone can import or install one, what remains separate from the shared package, and one low-risk first test. Link every source beside the statement it supports. If the documentation does not answer a question, say so. Do not add information from another source.",
    conversationExcerpt: [
      {
        role: "Person",
        text: "Prepare a concise research brief for a first-time Hermes user. Use only the supplied facts and keep the answer under 150 words.",
        abridged: true,
      },
      {
        role: "Bot",
        text: "Research brief complete. Separate profiles keep their own conversation and tools. A portable profile archive can be imported into Hermes Desktop. The finished brief is ready for review.",
        abridged: true,
      },
    ],
    conversationDisclosure: "These abridged lines summarize the preserved demonstration. They are not a complete raw transcript.",
    recordedMedia: {
      label: "Watch the recorded excerpt",
      description: "A short editorial demonstration using the preserved Scout excerpt.",
      href: "/videos/bot-cabinet-scout-in-action.mp4",
      poster: "/proof-room/scout-in-action-poster.webp",
      mimeType: "video/mp4",
      caption: "Recorded Scout excerpt. Complete run documentation is still required.",
    },
    supportingArtifacts: [
      {
        label: "Download the Scout Hermes profile",
        description: "Version 1.0.0 profile archive for Hermes Agent 0.20 or later.",
        href: "/downloads/starter-bots/scout.tar.gz",
        download: true,
      },
      {
        label: "Inspect the readable Scout files",
        description: "ZIP package containing the same six readable source files.",
        href: "/downloads/starter-bots/scout.zip",
        download: true,
      },
    ],
    humanDecisions: [
      "Choose the exact question and approved sources.",
      "Check every important statement against the linked source.",
      "Decide whether the brief is accurate and useful enough to share.",
    ],
    profileVersion: "1.0.0",
    passportVersion: 1,
    checks: [
      { label: "Package checks", state: "passed", detail: "The profile archive and ZIP contain the six declared files and match the readable copies.", checkedAt: "2026-08-28" },
      { label: "Profile import", state: "passed", detail: "The Scout archive was imported with Hermes Agent 0.20.5.", checkedAt: "2026-08-28" },
      { label: "Role run", state: "partial", detail: "A video excerpt exists, but the complete raw run record was not preserved." },
      { label: "Reproduction", state: "not-run", detail: "A clean, isolated rerun has not been completed." },
      commonTechnicalReview,
    ],
  },
  {
    slug: "writer-article-draft",
    botSlug: "writer",
    cardImage: "/proof-room/thumbnails/writer.webp",
    title: "Writer test for an article draft from an approved brief",
    outcome: "Intended result after a preserved run: a source-bound draft with headline options and questions for the author",
    summary: "The exact prompt, package, and acceptance requirements are ready. The approved source brief and Hermes role run are still pending.",
    state: "test-designed",
    stateDetail: "source input pending",
    platform: "Hermes Agent",
    evidenceNote: "Bot Cabinet has designed this test and published the exact request. It will not show a conversation or finished article until the source brief is approved and a real Hermes run and its artifacts have been preserved.",
    inputStatus: "planned",
    fixtureDisclosure: "The test will use the human-approved Scout brief from the preceding demonstration as its only factual source.",
    inputArtifacts: [
      {
        label: "Approved Scout brief",
        description: "The final, source-checked brief will become the Writer input after the Scout reproduction passes.",
      },
    ],
    exactPrompt: "Using only the approved Scout brief, draft a 600-word article for nontechnical professionals explaining how a named Bot can carry an ongoing role inside Hermes. Use plain English and active voice. Open with one everyday example, include a four-step setup overview, provide three headline options, and end with questions that require the author’s judgment. Mark any claim the brief does not support. Do not publish or add facts.",
    supportingArtifacts: [
      {
        label: "Download the Writer Hermes profile",
        description: "Version 1.0.0 profile archive for Hermes Agent 0.20 or later.",
        href: "/downloads/starter-bots/writer.tar.gz",
        download: true,
      },
      {
        label: "Inspect the readable Writer files",
        description: "ZIP package containing the same six readable source files.",
        href: "/downloads/starter-bots/writer.zip",
        download: true,
      },
    ],
    humanDecisions: [
      "Approve the source brief before drafting begins.",
      "Choose the headline and decide how the article should sound.",
      "Check every factual claim and approve the final wording.",
    ],
    profileVersion: "1.0.0",
    passportVersion: 1,
    checks: [
      { label: "Package checks", state: "passed", detail: "The profile archive and ZIP contain the six declared files and match the readable copies.", checkedAt: "2026-08-28" },
      { label: "Profile import", state: "not-run", detail: "This profile has not been individually imported into Hermes Desktop." },
      { label: "Role run", state: "not-run", detail: "The designed article-draft test has not been run." },
      { label: "Reproduction", state: "not-run", detail: "Reproduction begins only after the first complete run is preserved." },
      commonTechnicalReview,
    ],
  },
  {
    slug: "chief-of-staff-operating-brief",
    botSlug: "chief-of-staff",
    cardImage: "/proof-room/thumbnails/chief-of-staff.webp",
    title: "Chief of Staff prepares an operating brief from a meeting",
    outcome: "Two recorded Hermes runs separated priorities, work, decisions, and ideas; the second also exposed two unsupported additions",
    summary: "Two genuine Hermes prompt-contract runs are preserved. The first met the disclosed acceptance checks. The second kept the core facts but added an unsupported deadline and responsibility, so package reproduction remains pending.",
    state: "prompt-contract-recorded",
    stateDetail: "one run passed; one exposed unsupported additions",
    platform: "Hermes Agent",
    evidenceNote: "Hermes Agent completed the disclosed role-and-request test twice. Run 1 met the acceptance assertions. Run 2 added “reply by end of day” and called Jordan a “post-check owner,” neither of which appears in the fixture. The exact downloadable profile was not imported, so this is not a reproduced package test.",
    inputStatus: "supplied",
    fixtureDisclosure: "The meeting transcript is fictional. It is designed to test whether the Bot preserves owners, dates, approvals, unassigned work, and ideas without inventing commitments.",
    inputArtifacts: [
      {
        label: "Fictional meeting transcript",
        description: "A small, public test fixture with confirmed work, an unassigned analytics task, one idea, and explicit approval limits.",
        href: "/proof-room/chief-of-staff/fictional-meeting-transcript.md",
      },
      {
        label: "Exact disclosed run prompt",
        description: "The role, request, fictional transcript, and acceptance checks sent in both runs.",
        href: "/proof-room/chief-of-staff/exact-run-prompt.md",
      },
    ],
    exactPrompt: "Turn this fictional sample transcript into a one-page operating brief. Separate confirmed priorities, assigned work, blocked decisions, and ideas. Preserve every owner and date exactly; write “unassigned” when an owner is missing. Flag capacity conflicts. Draft a five-item meeting agenda and a follow-up message for review. Do not assign people, change dates, contact anyone, or invent commitments.",
    conversationExcerpt: [
      {
        role: "Person",
        text: "Turn this fictional sample transcript into a one-page operating brief. Preserve every owner and date exactly; write ‘unassigned’ when an owner is missing. Do not invent commitments.",
        abridged: true,
      },
      {
        role: "Bot",
        text: "Run 1 kept analytics unassigned, the newsletter as an idea, publication pending Maya’s approval, and the budget unchanged. It passed the disclosed assertions.",
        abridged: true,
      },
      {
        role: "Bot",
        text: "Run 2 kept the core facts but added an unsupported ‘reply by end of day’ request and described Jordan as a ‘post-check owner.’ It did not pass every assertion.",
        abridged: true,
      },
    ],
    conversationDisclosure: "These are concise excerpts from two independent Hermes CLI runs. The complete final responses and sanitized run summary are linked below. Provider-internal reasoning and session identifiers are not published.",
    deliverable: {
      label: "Run 1 operating brief",
      description: "The complete final response from the run that met the disclosed acceptance assertions.",
      href: "/proof-room/chief-of-staff/run-1-operating-brief.md",
      download: true,
    },
    supportingArtifacts: [
      {
        label: "Inspect run 2 and its unsupported additions",
        description: "The complete second final response is preserved rather than silently corrected.",
        href: "/proof-room/chief-of-staff/run-2-operating-brief.md",
        download: true,
      },
      {
        label: "Inspect the sanitized run summary",
        description: "Hermes version, provider, model, timing, estimated cost, tokens, hashes, and assertion results. No session identifiers or secrets are included.",
        href: "/proof-room/chief-of-staff/run-summary.json",
        download: true,
      },
      {
        label: "Download the Chief of Staff Hermes profile",
        description: "Version 1.0.0 profile archive for Hermes Agent 0.20 or later.",
        href: "/downloads/starter-bots/chief-of-staff.tar.gz",
        download: true,
      },
      {
        label: "Inspect the readable Chief of Staff files",
        description: "ZIP package containing the same six readable source files.",
        href: "/downloads/starter-bots/chief-of-staff.zip",
        download: true,
      },
    ],
    humanDecisions: [
      "Confirm that the transcript is complete and accurate.",
      "Assign the analytics work that the transcript leaves unassigned.",
      "Approve priorities, commitments, and any follow-up before it is sent.",
    ],
    profileVersion: "1.0.0",
    passportVersion: 1,
    run: {
      runAt: "2026-09-02",
      hermesVersion: "0.21.0",
      provider: "nous",
      model: "deepseek/deepseek-v4-flash-0731",
      elapsedNote: "Run 1 was not timed; run 2 completed in 8 seconds.",
      costUsd: 0.0012436704,
      costNote: "About $0.00124 total across two estimated calls.",
    },
    checks: [
      { label: "Package checks", state: "passed", detail: "The profile archive and ZIP contain the six declared files and match the readable copies.", checkedAt: "2026-08-28" },
      { label: "Profile import", state: "not-run", detail: "The exact downloadable Chief of Staff profile was not imported for these runs." },
      { label: "Role run", state: "partial", detail: "Hermes Agent completed the disclosed role and request twice. One run passed the acceptance assertions; one added two unsupported details.", checkedAt: "2026-09-02" },
      { label: "Reproduction", state: "not-run", detail: "Repeating the prompt without importing the exact profile is not a package reproduction." },
      commonTechnicalReview,
    ],
  },
];

export function getProofRoomDemo(slug: string) {
  return PROOF_ROOM_DEMOS.find((demo) => demo.slug === slug);
}
