export type ProofState = "test-designed" | "test-prepared" | "recorded-excerpt" | "reproduced";
export type ProofCheckState = "passed" | "partial" | "not-run" | "unavailable";

export const PROOF_STATE_NAMES: Record<ProofState, string> = {
  "test-designed": "Test designed",
  "test-prepared": "Test prepared",
  "recorded-excerpt": "Recorded excerpt",
  reproduced: "Reproduced",
};

export const PROOF_PROMPT_HEADINGS: Record<ProofState, string> = {
  "test-designed": "The prompt designed for this test",
  "test-prepared": "The prompt prepared for this test",
  "recorded-excerpt": "The prompt prepared for a complete reproduction",
  reproduced: "The prompt used for this reproduced run",
};

export const PROOF_PROMPT_EYEBROWS: Record<ProofState, string> = {
  "test-designed": "Planned request",
  "test-prepared": "Prepared request",
  "recorded-excerpt": "Reproduction request",
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
  model?: string;
  elapsedSeconds?: number;
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
    title: "Chief of Staff test for an operating brief from a meeting",
    outcome: "Intended result after a preserved run: confirmed priorities, assigned work, blocked decisions, ideas, an agenda, and a follow-up draft",
    summary: "The fictional transcript, exact prompt, package, and acceptance requirements are ready. No Hermes role run has been published.",
    state: "test-prepared",
    stateDetail: "run not completed",
    platform: "Hermes Agent",
    evidenceNote: "Bot Cabinet has prepared a fictional transcript and exact request. It will publish a result only after a real Hermes run preserves the complete conversation and output.",
    inputStatus: "supplied",
    fixtureDisclosure: "The meeting transcript is fictional. It is designed to test whether the Bot preserves owners, dates, approvals, unassigned work, and ideas without inventing commitments.",
    inputArtifacts: [
      {
        label: "Fictional meeting transcript",
        description: "A small, public test fixture with confirmed work, an unassigned analytics task, one idea, and explicit approval limits.",
        href: "/proof-room/chief-of-staff/fictional-meeting-transcript.md",
      },
    ],
    exactPrompt: "Turn this fictional sample transcript into a one-page operating brief. Separate confirmed priorities, assigned work, blocked decisions, and ideas. Preserve every owner and date exactly; write “unassigned” when an owner is missing. Flag capacity conflicts. Draft a five-item meeting agenda and a follow-up message for review. Do not assign people, change dates, contact anyone, or invent commitments.",
    supportingArtifacts: [
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
    checks: [
      { label: "Package checks", state: "passed", detail: "The profile archive and ZIP contain the six declared files and match the readable copies.", checkedAt: "2026-08-28" },
      { label: "Profile import", state: "not-run", detail: "This profile has not been individually imported into Hermes Desktop." },
      { label: "Role run", state: "not-run", detail: "The prepared operating-brief test has not been run." },
      { label: "Reproduction", state: "not-run", detail: "Reproduction begins only after the first complete run is preserved." },
      commonTechnicalReview,
    ],
  },
];

export function getProofRoomDemo(slug: string) {
  return PROOF_ROOM_DEMOS.find((demo) => demo.slug === slug);
}
