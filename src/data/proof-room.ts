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
  reproduced: "Instructions for repeating this run",
};

export const PROOF_PROMPT_EYEBROWS: Record<ProofState, string> = {
  "test-designed": "Planned request",
  "test-prepared": "Prepared request",
  "recorded-excerpt": "Reproduction request",
  "prompt-contract-recorded": "Recorded request",
  reproduced: "Run request",
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
  botSlug: "scout" | "writer" | "chief-of-staff" | "curator" | "reentry" | "receipt";
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
  profileArchiveHref: string;
  profileArchiveSha256?: string;
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
    profileArchiveHref: "/downloads/starter-bots/scout.tar.gz",
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
    profileArchiveHref: "/downloads/starter-bots/writer.tar.gz",
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
    profileArchiveHref: "/downloads/starter-bots/chief-of-staff.tar.gz",
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
  {
    slug: "curator-lineup-review",
    botSlug: "curator",
    cardImage: "/downloads/bot-portraits/hermes/curator-1024.png",
    title: "Curator reviews an overlapping Bot lineup",
    outcome: "Two exact-package runs found likely overlap without inventing performance evidence",
    summary: "The final Curator 2.0.0 archive was imported into Hermes and ran the same fictional lineup review twice. Both validation runs passed the disclosed checks; the earlier complete outputs remain published below.",
    state: "reproduced",
    stateDetail: "exact package passed twice",
    platform: "Hermes Agent",
    evidenceNote: "The fingerprinted downloadable Curator archive was imported as a temporary Hermes test profile after final generation. Two validation runs used the same public fixture and request. Both treated the overlap as likely rather than proven, kept the occasional Invoice Helper at unknown effectiveness, proposed a comparison test, and applied no changes. The complete published outputs below came from the immediately preceding runs with the same profile contents, before the README status text was regenerated.",
    inputStatus: "supplied",
    fixtureDisclosure: "The three profiles, role descriptions, and dated outputs are fictional. They test whether Curator preserves uncertainty and avoids equating missing logs with failure.",
    inputArtifacts: [{ label: "Fictional Bot lineup", description: "The complete public fixture and acceptance checks.", href: "/proof-room/curator/fictional-lineup.md" }],
    exactPrompt: "Run the Curator first mission using only the fictional evidence below. Return a concise Lineup Review suitable for human review. Do not change anything. Identify likely overlap without declaring it proven; treat Invoice Helper effectiveness as unknown, not poor; recommend lineup decisions with reasons and confidence; draft one representative comparison test; preserve human approval and make no changes.",
    conversationExcerpt: [
      { role: "Person", text: "Review two similar newsletter Bots and one occasional Invoice Helper. Treat overlap as a finding to test, not a proven conclusion, and make no changes.", abridged: true },
      { role: "Bot", text: "Both runs marked the newsletter overlap likely but unproven, kept Invoice Helper at unknown effectiveness, and proposed a controlled comparison before any merger.", abridged: true },
    ],
    conversationDisclosure: "The full second-run prompt and response are published in the transcript. The first complete result is preserved separately. Provider-internal reasoning and session identifiers are not published.",
    transcript: { label: "Read the complete second-run transcript", description: "The complete request and final response from the earlier reproduced run.", href: "/proof-room/curator/run-2-transcript.md", download: true },
    deliverable: { label: "Download the first Lineup Review", description: "The complete review produced by the earlier first run.", href: "/proof-room/curator/run-1-lineup-review.md", download: true },
    supportingArtifacts: [
      { label: "Inspect the run summary", description: "The final archive fingerprint and recorded runtime details.", href: "/proof-room/curator/run-summary.json", download: true },
      { label: "Download the Curator Hermes profile", description: "The fingerprinted version 2.0.0 archive used in both final validation runs.", href: "/downloads/starter-bots/v2/curator.tar.gz", download: true },
      { label: "Inspect the readable Curator files", description: "The readable package corresponding to the tested profile.", href: "/downloads/starter-bots/v2/curator.zip", download: true },
    ],
    humanDecisions: ["Decide whether the two newsletter roles should remain separate.", "Approve any comparison test before it runs.", "Approve any future instruction edit, merger, or archive action."],
    profileVersion: "2.0.0",
    profileArchiveHref: "/downloads/starter-bots/v2/curator.tar.gz",
    profileArchiveSha256: "7236d29be020f10bc9d87eadf3ec1b68c49e902aa293806ca0490d1e10532afa",
    passportVersion: 2,
    run: { runAt: "2026-09-09", hermesVersion: "0.21.1", provider: "nous", model: "deepseek/deepseek-v4-flash", elapsedSeconds: 30, costUsd: 0.0004439547, costNote: "The preserved second run was estimated at $0.000444. The first run completed successfully, but its usage file was not retained." },
    checks: [
      { label: "Package checks", state: "passed", detail: "The generated archive and readable package passed the repository package checks.", checkedAt: "2026-09-09" },
      { label: "Profile import", state: "passed", detail: "The exact Curator 2.0.0 archive imported with its bundled Skill present.", checkedAt: "2026-09-09" },
      { label: "Role run", state: "passed", detail: "The first run met every disclosed acceptance check and preserved its complete result.", checkedAt: "2026-09-09" },
      { label: "Reproduction", state: "passed", detail: "The same profile, fixture, and request passed the disclosed checks in a second independent run.", checkedAt: "2026-09-09" },
      commonTechnicalReview,
    ],
  },
  {
    slug: "reentry-project-resumption",
    botSlug: "reentry",
    cardImage: "/downloads/bot-portraits/hermes/reentry-1024.png",
    title: "Reentry restores the last approved checkpoint",
    outcome: "Two exact-package runs kept a newer proposal separate from approved work",
    summary: "The final Reentry 2.0.0 archive was imported into Hermes and ran the same fictional project-resumption test twice. Both validation runs passed the disclosed checks; the earlier complete outputs remain published below.",
    state: "reproduced",
    stateDetail: "exact package passed twice",
    platform: "Hermes Agent",
    evidenceNote: "The fingerprinted downloadable Reentry archive was imported after final generation. Both validation runs identified the Monday draft as the last approved checkpoint, kept Tuesday's edits at proposed status, treated publication as unconfirmed, and protected the approved restaurant language. Neither run edited or published anything. The complete published outputs below came from the immediately preceding runs with the same profile contents, before the README status text was regenerated.",
    inputStatus: "supplied",
    fixtureDisclosure: "The project, filenames, messages, and publication note are fictional. The fixture tests whether a newer file is incorrectly promoted to approved status.",
    inputArtifacts: [{ label: "Fictional project record", description: "The dated drafts, approval message, proposal note, and acceptance checks.", href: "/proof-room/reentry/fictional-project-record.md" }],
    exactPrompt: "Run the Reentry first mission using only this fictional project record. Produce a concise resumption brief and do not edit or publish anything. Identify Monday as the last approved checkpoint; label Tuesday changes proposed rather than approved; label publication unconfirmed; preserve the protected restaurant language; state the minimum next action and one necessary question.",
    conversationExcerpt: [
      { role: "Person", text: "Resume from an approved Monday draft, a newer but unapproved Tuesday draft, and an unsupported suggestion that publication might happen.", abridged: true },
      { role: "Bot", text: "Both runs retained Monday as the approved checkpoint, labeled Tuesday proposed, marked publication unconfirmed, and kept the protected restaurant language in force.", abridged: true },
    ],
    conversationDisclosure: "The full second-run prompt and response are published in the transcript. The first complete result is preserved separately.",
    transcript: { label: "Read the complete second-run transcript", description: "The complete request and final response from the earlier reproduced run.", href: "/proof-room/reentry/run-2-transcript.md", download: true },
    deliverable: { label: "Download the first resumption brief", description: "The complete brief produced by the earlier first run.", href: "/proof-room/reentry/run-1-resumption-brief.md", download: true },
    supportingArtifacts: [
      { label: "Inspect the run summary", description: "The final archive fingerprint and recorded runtime details.", href: "/proof-room/reentry/run-summary.json", download: true },
      { label: "Download the Reentry Hermes profile", description: "The fingerprinted version 2.0.0 archive used in both final validation runs.", href: "/downloads/starter-bots/v2/reentry.tar.gz", download: true },
      { label: "Inspect the readable Reentry files", description: "The readable package corresponding to the tested profile.", href: "/downloads/starter-bots/v2/reentry.zip", download: true },
    ],
    humanDecisions: ["Decide whether any proposed Tuesday edit should supersede the approved draft.", "Confirm whether protected language may change.", "Approve publication and retain a deployment record."],
    profileVersion: "2.0.0",
    profileArchiveHref: "/downloads/starter-bots/v2/reentry.tar.gz",
    profileArchiveSha256: "0cad677d1edd4649410f0dec954b29a7ea1731168f90d2b4dbc98b82f46eb698",
    passportVersion: 2,
    run: { runAt: "2026-09-09", hermesVersion: "0.21.1", provider: "nous", model: "deepseek/deepseek-v4-flash", elapsedSeconds: 23.33, costUsd: 0.0002845104, costNote: "The preserved second run was estimated at $0.000285. The first run completed successfully, but its usage file was not retained." },
    checks: [
      { label: "Package checks", state: "passed", detail: "The generated archive and readable package passed the repository package checks.", checkedAt: "2026-09-09" },
      { label: "Profile import", state: "passed", detail: "The exact Reentry 2.0.0 archive imported with its bundled Skill present.", checkedAt: "2026-09-09" },
      { label: "Role run", state: "passed", detail: "The first run met every disclosed status and approval check.", checkedAt: "2026-09-09" },
      { label: "Reproduction", state: "passed", detail: "The same profile, fixture, and request passed the disclosed checks in a second independent run.", checkedAt: "2026-09-09" },
      commonTechnicalReview,
    ],
  },
  {
    slug: "receipt-refund-case",
    botSlug: "receipt",
    cardImage: "/downloads/bot-portraits/hermes/receipt-1024.png",
    title: "Receipt tracks a promised refund",
    outcome: "Two exact-package runs kept approval, issuance, and receipt as separate facts",
    summary: "The final Receipt 2.0.0 archive was imported into Hermes and ran the same fictional refund case twice. Both validation runs passed the disclosed checks; the earlier complete outputs remain published below.",
    state: "reproduced",
    stateDetail: "exact package passed twice",
    platform: "Hermes Agent",
    evidenceNote: "The fingerprinted downloadable Receipt archive was imported after final generation. Both validation runs kept the case open, declined to invent a deadline from undated email, separated a requested and approved refund from issuance and receipt, and produced a factual draft that was not sent. The complete published outputs below came from the immediately preceding runs with the same profile contents, before the README status text was regenerated.",
    inputStatus: "supplied",
    fixtureDisclosure: "The order, amount, product, emails, and case number are fictional. No real purchase, account, or payment data was used.",
    inputArtifacts: [{ label: "Fictional refund case", description: "The complete public case fixture and acceptance checks.", href: "/proof-room/receipt/fictional-refund-case.md" }],
    exactPrompt: "Run the Receipt first mission using only this fictional case. Produce a concise case record and draft follow-up. Do not send anything. Distinguish requested, approved or promised, issued, and received; do not calculate a deadline without the promise date; request only missing information needed; leave the case open; draft a factual message for human review; do not send it or assert legal rights.",
    conversationExcerpt: [
      { role: "Person", text: "Track an $80 refund promised within ten business days when the promise date and payment confirmation are missing.", abridged: true },
      { role: "Bot", text: "Both runs recorded the promise without calling the refund issued or received, requested the missing dates and transaction evidence, kept the case open, and drafted but did not send a follow-up.", abridged: true },
    ],
    conversationDisclosure: "The full second-run prompt and response are published in the transcript. The first complete case record is preserved separately.",
    transcript: { label: "Read the complete second-run transcript", description: "The complete request and final response from the earlier reproduced run.", href: "/proof-room/receipt/run-2-transcript.md", download: true },
    deliverable: { label: "Download the first case record", description: "The complete case record and draft produced by the earlier first run.", href: "/proof-room/receipt/run-1-case-record.md", download: true },
    supportingArtifacts: [
      { label: "Inspect the run summary", description: "The final archive fingerprint and recorded runtime details.", href: "/proof-room/receipt/run-summary.json", download: true },
      { label: "Download the Receipt Hermes profile", description: "The fingerprinted version 2.0.0 archive used in both final validation runs.", href: "/downloads/starter-bots/v2/receipt.tar.gz", download: true },
      { label: "Inspect the readable Receipt files", description: "The readable package corresponding to the tested profile.", href: "/downloads/starter-bots/v2/receipt.zip", download: true },
    ],
    humanDecisions: ["Supply or withhold the missing transaction evidence.", "Review and revise any follow-up message.", "Choose whether to send a message and confirm when the case should close."],
    profileVersion: "2.0.0",
    profileArchiveHref: "/downloads/starter-bots/v2/receipt.tar.gz",
    profileArchiveSha256: "622788dce90e9e74de9c8e6ab419fb79a0f678d38a7b96229619d557e36ed001",
    passportVersion: 2,
    run: { runAt: "2026-09-09", hermesVersion: "0.21.1", provider: "nous", model: "deepseek/deepseek-v4-flash", elapsedSeconds: 29.73, costUsd: 0.0004241004, costNote: "The preserved second run was estimated at $0.000424. The first run completed successfully, but its usage file was not retained." },
    checks: [
      { label: "Package checks", state: "passed", detail: "The generated archive and readable package passed the repository package checks.", checkedAt: "2026-09-09" },
      { label: "Profile import", state: "passed", detail: "The exact Receipt 2.0.0 archive imported with its bundled Skill present.", checkedAt: "2026-09-09" },
      { label: "Role run", state: "passed", detail: "The first run met every disclosed evidence, deadline, and approval check.", checkedAt: "2026-09-09" },
      { label: "Reproduction", state: "passed", detail: "The same profile, fixture, and request passed the disclosed checks in a second independent run.", checkedAt: "2026-09-09" },
      commonTechnicalReview,
    ],
  },
];

export function getProofRoomDemo(slug: string) {
  return PROOF_ROOM_DEMOS.find((demo) => demo.slug === slug);
}
