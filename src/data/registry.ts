export type RegistryCategory =
  | "getting-started"
  | "research"
  | "tools"
  | "creative"
  | "personal"
  | "operations";

export type ReviewSurface = "narrow" | "standard" | "elevated";

export interface RegistryEntry {
  slug: string;
  name: string;
  maintainer: string;
  category: RegistryCategory;
  summary: string;
  bestFor: string;
  exampleTasks: string[];
  expectedOutput: string[];
  setupNotes: string[];
  image: string;
  version: string;
  hermesRequires?: string;
  license: string;
  commitDate: string;
  sha: string;
  repository: string;
  reviewSurface: ReviewSurface;
  distributionOwned: "explicit" | "omitted";
  includedPaths: string[];
  sourceSignals: string[];
  caution: string;
}

export const CATEGORY_LABELS: Record<RegistryCategory, string> = {
  "getting-started": "Getting started",
  research: "Research",
  tools: "Tools & diagnostics",
  creative: "Creative work",
  personal: "Personal assistance",
  operations: "Operations",
};

export const REVIEW_SURFACE_LABELS: Record<ReviewSurface, string> = {
  narrow: "Fewer files to inspect",
  standard: "Several files to inspect",
  elevated: "Closer technical review needed",
};

export const REVIEW_SURFACE_EXPLANATIONS: Record<ReviewSurface, string> = {
  narrow: "The package contains a small number of plain files, so a reviewer has less material to check.",
  standard: "The package contains several files or actions that a reviewer should check before use.",
  elevated: "The package contains scripts, broad access, schedules, or outside connections that require closer technical review.",
};

/**
 * A deliberately small source-preview shelf from the 2026-08-25 ecosystem scan.
 * These records are not safety approvals or runtime verification. Their exact
 * evidence state is rendered on every detail page.
 */
export const REGISTRY_ENTRIES: RegistryEntry[] = [
  {
    slug: "hermes-starter-profile",
    name: "Hermes Starter Profile",
    maintainer: "Teknium",
    category: "getting-started",
    summary: "A small public example for learning how Hermes profile files fit together and adapting a basic role.",
    bestFor: "People who already have Hermes installed and want a small public example of how profile files fit together.",
    exampleTasks: ["Explore a basic Hermes profile", "Adapt a simple role for personal use", "Study a public distribution before creating your own"],
    expectedOutput: ["A working starter profile", "Examples of profile instructions and supporting scripts"],
    setupNotes: ["Requires Hermes 0.20 or newer", "Includes scripts that should be read before use"],
    image: "/atelier/archivist.jpg",
    version: "0.2.0",
    hermesRequires: ">=0.20.0",
    license: "MIT — LICENSE present",
    commitDate: "2026-08-09",
    sha: "24dc015efa46936c8370ae7582796437b9735822",
    repository: "teknium1/hermes-starter-profile",
    reviewSurface: "elevated",
    distributionOwned: "explicit",
    includedPaths: ["SOUL.md", "config.yaml", ".no-bundled-skills", "README.md", "GETTING_STARTED.md", "DESIGN.md", "scripts"],
    sourceSignals: ["The repository includes distribution.yaml, which tells Hermes how to install the profile.", "The package file names the files it adds.", "The package file states a minimum Hermes version.", "A license file explains how others may use the code."],
    caution: "This package contains scripts. Scripts can run commands, so a technical reviewer should read them before anyone uses the profile.",
  },
  {
    slug: "emh-diagnostic-profile",
    name: "EMH Diagnostic Profile",
    maintainer: "Jonathan Rivera / AtlasOmnia",
    category: "tools",
    summary: "Explains redacted Hermes errors or logs, identifies likely configuration problems, and prepares a repair checklist.",
    bestFor: "Hermes users who need help understanding an error, configuration problem, or failed setup.",
    exampleTasks: ["Explain an error from a redacted log", "Identify likely configuration problems", "Prepare a repair checklist for review"],
    expectedOutput: ["A diagnosis in plain language", "A proposed sequence of checks or repairs"],
    setupNotes: ["Provide redacted logs or error messages", "Review any requested terminal or file access before allowing it"],
    image: "/atelier/cicada.jpg",
    version: "0.2.9",
    hermesRequires: ">=0.14.0",
    license: "MIT — LICENSE present",
    commitDate: "2026-08-22",
    sha: "dba65adc1d4952b3da22f41244384a645ff7ec27",
    repository: "AtlasOmnia/EMH-A-Hermes-Diagnostic-Profile",
    reviewSurface: "standard",
    distributionOwned: "explicit",
    includedPaths: ["SOUL.md", "skills/", "skins/"],
    sourceSignals: ["The repository includes distribution.yaml, which tells Hermes how to install the profile.", "The package file names the files it adds.", "The package file states a minimum Hermes version.", "A license file explains how others may use the code."],
    caution: "This profile may ask for terminal or file access while diagnosing a problem. A user should review each requested action before allowing it.",
  },
  {
    slug: "volcanic-profile-builder",
    name: "Volcanic Profile Builder",
    maintainer: "VolcanicWorks",
    category: "tools",
    summary: "Drafts, organizes, and checks the files for a public Hermes profile package.",
    bestFor: "Technical Hermes users who want help organizing a profile for public release.",
    exampleTasks: ["Create the files for a new public profile", "Check a package before publishing", "Generate a basic profile structure"],
    expectedOutput: ["A profile package draft", "A scan report and publishing checklist"],
    setupNotes: ["Requires comfort with files and terminal tools", "Review bundled scripts before running them"],
    image: "/atelier/navigator.jpg",
    version: "1.0.0",
    hermesRequires: ">=0.15.0",
    license: "MIT — LICENSE present",
    commitDate: "2026-06-18",
    sha: "2bd6468218dec51d9381ac9ead0f4d8c7f70c138",
    repository: "VolcanicWorks/volcanic-profile-builder",
    reviewSurface: "elevated",
    distributionOwned: "explicit",
    includedPaths: [
      "README.md",
      "SOUL.md",
      "config.yaml",
      "distribution.yaml",
      "profile.yaml",
      ".env.EXAMPLE",
      ".gitignore",
      "LICENSE",
      "cron/README.md",
      "scripts/profile_secret_scan.py",
      "skills/profile-scaffolding/SKILL.md",
      "skills/profile-registry-readiness/SKILL.md",
      "templates/registry_readiness_report.md",
    ],
    sourceSignals: ["The repository includes distribution.yaml, which tells Hermes how to install the profile.", "The package file names the files it adds.", "The package file states a minimum Hermes version.", "A license file explains how others may use the code."],
    caution: "This project can run commands and change files while it builds a package. A technical reviewer should inspect the scripts and test them in a separate project copy.",
  },
  {
    slug: "volcanic-hermes-doctor",
    name: "Volcanic Hermes Doctor",
    maintainer: "VolcanicWorks",
    category: "tools",
    summary: "Explains redacted Hermes logs, compares configuration symptoms, and prepares a troubleshooting plan.",
    bestFor: "Technical Hermes users who need a structured review of logs and configuration symptoms.",
    exampleTasks: ["Explain why a Hermes service failed to start", "Compare a log with expected configuration", "Prepare a troubleshooting plan"],
    expectedOutput: ["A likely-cause summary", "A step-by-step troubleshooting plan"],
    setupNotes: ["Remove credentials and personal information from logs", "Approve terminal or file changes one at a time"],
    image: "/atelier/mechanic.jpg",
    version: "1.0.0",
    hermesRequires: ">=0.15.0",
    license: "MIT — LICENSE present",
    commitDate: "2026-06-18",
    sha: "88474e22b03ce04ef6e9cc577f6e7e7e8af7ee36",
    repository: "VolcanicWorks/volcanic-hermes-doctor",
    reviewSurface: "elevated",
    distributionOwned: "explicit",
    includedPaths: [
      "README.md",
      "SOUL.md",
      "config.yaml",
      "distribution.yaml",
      "profile.yaml",
      ".env.EXAMPLE",
      ".gitignore",
      "LICENSE",
      "cron/README.md",
      "scripts/profile_secret_scan.py",
      "skills/hermes-troubleshooting-triage/SKILL.md",
      "skills/redacted-issue-report/SKILL.md",
      "templates/redacted_issue_report.md",
    ],
    sourceSignals: ["The repository includes distribution.yaml, which tells Hermes how to install the profile.", "The package file names the files it adds.", "The package file states a minimum Hermes version.", "A license file explains how others may use the code."],
    caution: "Troubleshooting may require commands or file changes. Logs can also contain private information, so users should remove credentials and personal details before sharing them.",
  },
  {
    slug: "ambush-news-streams",
    name: "Ambush News Streams",
    maintainer: "Ambush AI",
    category: "research",
    summary: "Creates, revises, pauses, summarizes, or deletes topic-based news streams for people who use Ambush AI.",
    bestFor: "People who already use Ambush AI and want Hermes to help manage topic-based news feeds.",
    exampleTasks: ["Create a news stream for a defined topic", "Pause or revise an existing stream", "Summarize the current stream settings"],
    expectedOutput: ["A configured Ambush news stream", "A summary of stream topics and settings"],
    setupNotes: ["Requires an Ambush account connection that lets Hermes act in that account", "The connection can change and permanently delete streams"],
    image: "/atelier/manta.jpg",
    version: "0.1.0",
    hermesRequires: ">=0.20.0",
    license: "MIT — LICENSE present",
    commitDate: "2026-08-14",
    sha: "10a04a1920be9522c14d280f4d31b8331be56365",
    repository: "Ambush-AI/hermes-profile",
    reviewSurface: "elevated",
    distributionOwned: "explicit",
    includedPaths: ["SOUL.md", "config.yaml", "skills/", "README.md", "CHANGELOG.md", "distribution.yaml"],
    sourceSignals: ["The repository includes distribution.yaml, which tells Hermes how to install the profile.", "The package file names the files it adds.", "The package file states a minimum Hermes version.", "A license file explains how others may use the code.", "config.yaml declares an outside account connection for Ambush AI."],
    caution: "The outside connection can create, change, pause, and permanently delete news streams in an Ambush account. A user should approve account changes before the Bot acts.",
  },
  {
    slug: "hermes-life-coach",
    name: "Hermes Life Coach",
    maintainer: "SongMarco",
    category: "personal",
    summary: "Runs short check-ins, journaling sessions, routine planning, reflection, and weekly reviews.",
    bestFor: "People who want a structured way to plan priorities, keep a journal, and review routines in Hermes.",
    exampleTasks: ["Run a five-minute morning check-in", "Help me choose three priorities for today", "Guide a weekly review of routines and unfinished work"],
    expectedOutput: ["A short priority plan", "Journal or reflection notes", "A weekly review with next steps"],
    setupNotes: ["Can work with local notes and optionally an Obsidian vault", "Personal reflections may contain sensitive information", "Review any scheduled routine before enabling it"],
    image: "/atelier/diplomat.jpg",
    version: "0.1.2",
    hermesRequires: ">=0.14.0",
    license: "MIT — LICENSE present",
    commitDate: "2026-05-28",
    sha: "d0a46b44bb33e71a21e3a105decbd60a9a3e181a",
    repository: "SongMarco/hermes-life-coach-agent",
    reviewSurface: "standard",
    distributionOwned: "omitted",
    includedPaths: ["SOUL.md", "config.yaml", "skills/", "cron/"],
    sourceSignals: ["A top-level distribution.yaml file identifies this as a Hermes profile package.", "The repository includes role instructions, skills, configuration, and optional schedules.", "The package can use a local Obsidian vault when the user supplies its path.", "A LICENSE file grants MIT permission."],
    caution: "This profile can work with private journal entries and personal routines. Use a separate test folder first and review what it may save or schedule.",
  },
  {
    slug: "home-admin",
    name: "Home Admin",
    maintainer: "capthvnsen",
    category: "personal",
    summary: "Organizes grocery lists, household reminders, purchase research, and weekly shopping plans.",
    bestFor: "Individuals or households that want help organizing routine errands without placing orders or handling payments.",
    exampleTasks: ["Turn this meal plan into a grocery list", "Research three replacement options for a household item", "Prepare this week’s household reminders"],
    expectedOutput: ["An organized grocery or household list", "A comparison of purchase options", "A dated reminder plan"],
    setupNotes: ["The published description says it does not place orders or handle payment", "Optional schedules should be reviewed before they are enabled", "Start with sample household information"],
    image: "/atelier/orrery.jpg",
    version: "0.1.0",
    hermesRequires: ">=0.12.0",
    license: "MIT named in distribution.yaml — no LICENSE file found",
    commitDate: "2026-08-18",
    sha: "a9a8d94f61e616580bd52823ac18b0374e3fdaa6",
    repository: "capthvnsen/hermes-profile-home-admin",
    reviewSurface: "standard",
    distributionOwned: "omitted",
    includedPaths: ["SOUL.md", "config.yaml", "skills/", "cron/"],
    sourceSignals: ["A top-level distribution.yaml file identifies this as a Hermes profile package.", "The repository includes role instructions, skills, configuration, and optional schedules.", "The package description limits the job to groceries, purchases, and reminders.", "The package file says MIT, but the recorded source version has no separate LICENSE file."],
    caution: "The repository names MIT in its package file but does not include the separate license text. Confirm reuse terms before redistributing it.",
  },
  {
    slug: "task-manager",
    name: "Task Manager",
    maintainer: "capthvnsen",
    category: "operations",
    summary: "Collects scattered work, sorts it by priority, and prepares morning and evening task briefs.",
    bestFor: "People who need a simple daily system for turning notes, messages, and loose requests into an ordered task list.",
    exampleTasks: ["Turn these notes into today’s prioritized task list", "Prepare a morning brief from unfinished work", "Review completed work and carry forward what remains"],
    expectedOutput: ["A prioritized task list", "A morning or evening work brief", "A clear list of unfinished items"],
    setupNotes: ["The root package file does not name outside account connections", "Optional schedules may create recurring briefs", "Review which notes or messages the Bot can read"],
    image: "/atelier/navigator.jpg",
    version: "0.1.0",
    hermesRequires: ">=0.12.0",
    license: "MIT named in distribution.yaml — no LICENSE file found",
    commitDate: "2026-08-18",
    sha: "3f0cc3d8e4bd4c82893559403d3950e3563a94f1",
    repository: "capthvnsen/hermes-profile-task-manager",
    reviewSurface: "standard",
    distributionOwned: "omitted",
    includedPaths: ["SOUL.md", "config.yaml", "skills/", "cron/"],
    sourceSignals: ["A top-level distribution.yaml file identifies this as a Hermes profile package.", "The repository includes role instructions, skills, configuration, and optional schedules.", "No required account keys are named in the package file.", "The package file says MIT, but the recorded source version has no separate LICENSE file."],
    caution: "A task manager may receive private messages, client details, and internal priorities. Limit its first test to sample tasks and review any schedule before enabling it.",
  },
  {
    slug: "project-mentor",
    name: "Project Mentor",
    maintainer: "Dr. Scott Savaiano / Bronx Science",
    category: "personal",
    summary: "Guides students through research questions, literature review, methods, proposals, and papers.",
    bestFor: "Students and educators who want a structured research mentor that asks questions and supports a long project step by step.",
    exampleTasks: ["Narrow a broad topic into a workable research question", "Plan a literature review", "Check whether a proposed method fits the research question"],
    expectedOutput: ["A research question and project plan", "A literature-review workflow", "Feedback on a proposal or paper draft"],
    setupNotes: ["Designed for a specific high-school research program", "Requires a teacher-issued OpenRouter key", "Uses a local Google Drive for Desktop folder", "The license limits commercial reuse and requires adaptations to use the same license"],
    image: "/atelier/archivist.jpg",
    version: "0.12.1",
    hermesRequires: ">=0.17.0",
    license: "CC BY-NC-SA 4.0 — LICENSE present",
    commitDate: "2026-08-25",
    sha: "125538e99f5aec40438729e742ffbff60f9e55cb",
    repository: "ScottSavaiano/project-mentor",
    reviewSurface: "elevated",
    distributionOwned: "omitted",
    includedPaths: ["SOUL.md", "config.yaml", "skills/"],
    sourceSignals: ["A top-level distribution.yaml file identifies this as a Hermes profile package.", "The package sets Hermes 0.17.0 as the minimum version.", "The repository includes a large set of research and writing skills.", "A LICENSE file grants noncommercial, attribution, and share-alike use."],
    caution: "This profile is built for students and may work with school records and long-term project files. Educators should review privacy, account, and licensing requirements before use.",
  },
  {
    slug: "hermes-researcher-agent",
    name: "Hermes Researcher Agent",
    maintainer: "Aleksei Ulianov / Sprut AI",
    category: "research",
    summary: "Researches public questions, compares sources, grades evidence, and prepares cited decision briefs.",
    bestFor: "People who need a documented comparison, source review, or briefing based on public information.",
    exampleTasks: ["Compare three software tools and cite every material claim", "Check the evidence behind a disputed statement", "Prepare a decision brief from public sources"],
    expectedOutput: ["A cited research brief", "A source list with confidence notes", "A comparison that separates facts, reports, and open questions"],
    setupNotes: ["Can use web, browser, RSS, Reddit, public APIs, files, and scripts", "Optional provider and search keys may be added", "Do not give it private source material until its access has been reviewed"],
    image: "/atelier/scout.jpg",
    version: "0.2.3",
    license: "MIT — LICENSE present",
    commitDate: "2026-06-08",
    sha: "0a4e0073e38cc00dda32bfc2c33f170b6c8e8bb4",
    repository: "AlekseiUL/hermes-researcher-agent",
    reviewSurface: "elevated",
    distributionOwned: "omitted",
    includedPaths: ["SOUL.md", "config.yaml", "skills/", "scripts/", "tools/"],
    sourceSignals: ["A top-level distribution.yaml file identifies this as a Hermes profile package.", "The package file names optional model and search-service keys.", "The repository includes research skills, scripts, tools, and examples.", "A LICENSE file grants MIT permission."],
    caution: "This project can browse, read files, and run scripts. Review the scripts, tools, and network services before using it with private material.",
  },
  {
    slug: "langus-hermes",
    name: "Langus Hermes",
    maintainer: "Cristian B.",
    category: "personal",
    summary: "Provides adaptive language lessons, practice sessions, spaced repetition, and progress tracking.",
    bestFor: "Language learners who want a recurring tutor with local progress records; Norwegian is the documented preset.",
    exampleTasks: ["Assess my current Norwegian level", "Create a 20-minute lesson from my weak areas", "Review vocabulary that is due for practice"],
    expectedOutput: ["An adaptive lesson", "Practice exercises and corrections", "A local progress and review record"],
    setupNotes: ["Norwegian is the documented preset", "An optional Groq key enables speech transcription", "The package includes a local engine, templates, and tests"],
    image: "/atelier/cicada.jpg",
    version: "0.4.0",
    hermesRequires: ">=0.16.0",
    license: "MIT named in distribution.yaml — no LICENSE file found",
    commitDate: "2026-07-20",
    sha: "4d1dd1bea7e709029bad7ee0ca89e1a521589059",
    repository: "cristianbdev/langus-hermes",
    reviewSurface: "elevated",
    distributionOwned: "explicit",
    includedPaths: ["distribution.yaml", "README.md", "SOUL.md", "AGENTS.md", "config.yaml", ".no-bundled-skills", "skills/", "skill-bundles/", "engine/", "templates/", "tests/"],
    sourceSignals: ["The package file explicitly names the files and folders it installs.", "The package sets Hermes 0.16.0 as the minimum version.", "The repository includes a local learning engine and automated tests.", "The package file says MIT, but the recorded source version has no separate LICENSE file."],
    caution: "The package includes a local engine and many supporting files. A technical reviewer should inspect the code and confirm reuse terms before public redistribution.",
  },
  {
    slug: "source-packet",
    name: "Source Packet",
    maintainer: "VolcanicWorks",
    category: "research",
    summary: "Turns links, documents, papers, repositories, or disputed claims into a cited evidence packet.",
    bestFor: "Researchers, writers, and decision-makers who need an organized set of sources before drafting or making a recommendation.",
    exampleTasks: ["Build a source packet for and against this policy claim", "Organize these papers by what each one supports", "Document the strongest evidence for a product decision"],
    expectedOutput: ["A structured packet of cited sources", "Notes on what each source supports", "Gaps and unresolved questions"],
    setupNotes: ["Can use browser, web, files, terminal, scripts, and optional model services", "Users may provide private documents", "Review scripts and schedules before use"],
    image: "/atelier/monolith.jpg",
    version: "1.0.0",
    hermesRequires: ">=0.15.0",
    license: "MIT named in distribution.yaml — no LICENSE file found",
    commitDate: "2026-06-18",
    sha: "164581b192108e7f377ea2af666df851b7f72dc7",
    repository: "VolcanicWorks/source-packet",
    reviewSurface: "elevated",
    distributionOwned: "explicit",
    includedPaths: ["SOUL.md", "config.yaml", "distribution.yaml", "README.md", ".env.EXAMPLE", "skills/", "scripts/", "templates/", "cron/"],
    sourceSignals: ["The package file explicitly names the files and folders it installs.", "The package sets Hermes 0.15.0 as the minimum version.", "The repository includes scripts, templates, research skills, and optional schedules.", "The package file says MIT, but the recorded source version has no separate LICENSE file."],
    caution: "This project can read files, browse, run scripts, and work on a schedule. Use sample documents until those permissions and scripts have been reviewed.",
  },
];

export function getRegistryEntry(slug: string) {
  return REGISTRY_ENTRIES.find((entry) => entry.slug === slug);
}

export function repositoryUrl(entry: RegistryEntry) {
  return `https://github.com/${entry.repository}`;
}

export function commitUrl(entry: RegistryEntry) {
  return `${repositoryUrl(entry)}/commit/${entry.sha}`;
}

export function manifestUrl(entry: RegistryEntry) {
  return `${repositoryUrl(entry)}/blob/${entry.sha}/distribution.yaml`;
}
