export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
  note?: string;
  sources?: { label: string; href: string }[];
};

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  audience: string;
  readTime: string;
  updated: string;
  sections: GuideSection[];
};

const official = {
  botMode: "https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode",
  profiles: "https://hermes-agent.nousresearch.com/docs/user-guide/profiles",
  distributions:
    "https://hermes-agent.nousresearch.com/docs/user-guide/profile-distributions",
  security: "https://hermes-agent.nousresearch.com/docs/user-guide/security",
  cron: "https://hermes-agent.nousresearch.com/docs/user-guide/features/cron/",
  commands: "https://hermes-agent.nousresearch.com/docs/reference/profile-commands/",
  release0205: "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.19",
};

export const GUIDES: Guide[] = [
  {
    slug: "what-is-a-hermes-bot",
    title: "What is a Hermes Bot?",
    summary:
      "A Hermes Bot is a named profile with its own role, settings, memory, skills, and chat history.",
    audience: "New to Bot Mode",
    readTime: "5 min",
    updated: "2026-08-25",
    sections: [
      {
        heading: "A Bot uses a Hermes profile",
        paragraphs: [
          "A Hermes profile stores one agent’s settings, memory, chat history, skills, credentials, role instructions, AI model choice, and avatar. Bot Mode displays those profiles as named Bots in Hermes Desktop. Each Bot has a continuing chat.",
          "The continuing conversation is central to the experience. You can return to the same named specialist, continue the work, and review earlier messages in the same thread.",
          "The profile keeps one Bot’s information separate from another Bot’s information. The Bots can also work together through group chats and direct messages.",
        ],
        sources: [
          { label: "Official Bot Mode guide", href: official.botMode },
          { label: "Official Profiles guide", href: official.profiles },
        ],
      },
      {
        heading: "What stays separate",
        bullets: [
          "Settings and AI model service choices",
          "Memory, sessions, and chat history",
          "Role instructions in SOUL.md, skills, and tools",
          "Credentials and integration settings",
          "Scheduled tasks and the Bot’s avatar",
        ],
        note: "Profile separation keeps Bot data apart. A locally running Bot can still use the files and tools that the person running Hermes allows it to use.",
        sources: [{ label: "Official security guide", href: official.security }],
      },
      {
        heading: "What Desktop makes easier",
        paragraphs: [
          "In Hermes Desktop v0.20.5, Bot Mode is built in and enabled by default. Choose New Agent, enter a Name, Title, and Description, then open Advanced when the job needs a specific AI model service, Custom SOUL.md role instructions, skills, tools, or connections to outside services.",
          "In Hermes v0.20.5, public profile package installation uses a terminal command documented in the profile command reference. The Community pages link to the publisher’s repository and show the current review and test status before they offer any installation guidance.",
        ],
        sources: [
          { label: "Official Bot Mode guide", href: official.botMode },
          { label: "Official profile command reference", href: official.commands },
          { label: "Hermes v0.20.5 release", href: official.release0205 },
        ],
      },
    ],
  },
  {
    slug: "inspect-before-you-install",
    title: "Inspect before you install",
    summary:
      "Learn how to read a public Bot package and its review status before installation.",
    audience: "Everyone",
    readTime: "8 min",
    updated: "2026-08-25",
    sections: [
      {
        heading: "Begin with the listing’s review status",
        bullets: [
          "Confirm the public repository and exact commit linked by the Registry. A commit is a fixed source version.",
          "Check whether anyone installed and tested that exact version. Look for the Hermes version, computer system, date, steps, and result.",
          "Read the required accounts, file access, tools, outside connections, schedules, and known limitations.",
          "Treat the project publisher’s description as untested until a recorded test reproduces it.",
        ],
      },
      {
        heading: "Read instructions and code that can cause actions",
        paragraphs: [
          "Review the files that can guide the Bot or trigger actions. Pay special attention to instructions that reveal credentials, change other profiles, disable safeguards, send data, install software, or make permanent changes.",
        ],
        bullets: [
          "SOUL.md contains the Bot’s continuing role instructions.",
          "Skills contain instructions for specific tasks.",
          "Scripts and setup commands can run work on the computer.",
          "Model Context Protocol (MCP) settings can connect the Bot to outside tools or accounts.",
          "Scheduled-task files can make work run automatically.",
          "Public files still require review for safety, maintenance, compatibility, and accurate documentation.",
        ],
        sources: [
          { label: "Official distribution guide", href: official.distributions },
          { label: "Official security guide", href: official.security },
        ],
      },
      {
        heading: "Check which repository files Hermes may copy",
        paragraphs: [
          "The package file, distribution.yaml, can name the files that Hermes may copy into a profile.",
        ],
        bullets: [
          "Find distribution_owned, the list of files that belong to the package.",
          "Confirm that every listed path belongs in the new profile.",
          "Review the exact project version before installation.",
          "If the list is missing or empty, the released v0.20.5 code may copy most files from the top level of the repository.",
        ],
        note: "The current documentation describes a smaller default file set, while the released v0.20.5 code preserves broader behavior in this case. Both sources are linked for a version-specific comparison.",
        sources: [
          { label: "Official distribution documentation", href: official.distributions },
          {
            label: "Official allowlist fix PR #75888",
            href: "https://github.com/NousResearch/hermes-agent/pull/75888",
          },
        ],
      },
    ],
  },
  {
    slug: "install-a-profile",
    title: "Install a profile with control",
    summary:
      "Use the documented terminal command, review the installation prompt, and begin with a small test.",
    audience: "Ready to try one",
    readTime: "7 min",
    updated: "2026-08-25",
    sections: [
      {
        heading: "Before the command",
        bullets: [
          "Update Hermes and note the version you are running.",
          "Open the source repository and compare its current version with the version linked by the Registry.",
          "Read every required account or credential name and decide whether the job truly needs it.",
          "Start with sample material or a copy. Keep client data, private messages, and irreplaceable files out of the first test.",
        ],
      },
      {
        heading: "What the install command does",
        paragraphs: [
          "Hermes uses a Git repository as the source for an installable profile package. Open a terminal and replace the example owner and repository below with the exact source shown on a listing.",
        ],
        code: "hermes profile install github.com/OWNER/REPOSITORY --alias",
        note: "The installer shows distribution.yaml, checks the names of required credentials, and asks for confirmation. Leave out --yes during a first installation so you can read and approve the prompt.",
        sources: [
          { label: "Official profile command reference", href: official.commands },
          { label: "Official distribution guide", href: official.distributions },
        ],
      },
      {
        heading: "Add your own credentials on your computer",
        paragraphs: [
          "A profile package can list the variable names it needs for account access. Hermes creates .env.EXAMPLE with those names. You add your own values locally. Keep credential values out of public repositories and Registry submissions.",
          "Review every included scheduled task before enabling it. Pay special attention to work that sends messages, publishes content, deletes material, makes purchases, or changes an outside system.",
        ],
      },
      {
        heading: "Run one test you can inspect",
        bullets: [
          "Ask the Bot to restate its job and the actions that require a person’s approval.",
          "Give it a tiny representative task.",
          "Watch which tools it requests and which files it reads or writes.",
          "Confirm it stops where the listing says a human must approve.",
          "Keep the profile only if the result matches the documented behavior and your expectations.",
        ],
      },
    ],
  },
  {
    slug: "share-a-sanitized-profile",
    title: "Prepare a public profile package",
    summary:
      "Build a new public package that contains only the role, files, and instructions you intend to share.",
    audience: "Bot authors",
    readTime: "9 min",
    updated: "2026-08-25",
    sections: [
      {
        heading: "Build a new directory for the public package",
        paragraphs: [
          "A working profile can contain credential files, account data, databases, sessions, memories, logs, cached documents, workspace files, and information about people or projects. Copy only the files you intend the public to receive into a new directory.",
        ],
        bullets: [
          "Write a fresh SOUL.md file containing the public role instructions.",
          "Include only original skills you have the right to license.",
          "Include scheduled tasks as disabled examples. Let the installer review and enable each one.",
          "List each required credential name and keep every credential value private.",
          "In distribution.yaml, the package file Hermes reads, use the distribution_owned list to name the exact files Hermes may copy.",
        ],
      },
      {
        heading: "Write the package for public use",
        paragraphs: [
          "Write new examples, settings, instructions, and documentation for people outside your organization. Review the complete Git history before publishing because removing a file from the latest version does not remove it from earlier public commits.",
        ],
        sources: [{ label: "Official authoring guide", href: official.distributions }],
      },
      {
        heading: "Minimum checks before release",
        bullets: [
          "distribution.yaml can be read by Hermes and matches the README.",
          "The credential and private-data scan has no unresolved findings.",
          "License text is present and covers every bundled component.",
          "Fresh install succeeds in a disposable profile.",
          "A representative first test produces the documented result.",
          "Limitations and actions that require a person’s approval are written in plain language.",
        ],
      },
    ],
  },
  {
    slug: "routines-with-control",
    title: "Use scheduled routines with approval points",
    summary:
      "Begin scheduled work with manual tests, clear approval points, and a record of every result.",
    audience: "Automation builders",
    readTime: "6 min",
    updated: "2026-08-25",
    sections: [
      {
        heading: "Frequent schedules repeat useful actions and mistakes",
        paragraphs: [
          "A task that runs every fifteen minutes runs up to 96 times in a day. That can multiply model use, notifications, file changes, and mistakes. Begin on demand. Try a daily schedule after several successful manual runs. Increase the frequency only after the results remain consistent.",
        ],
      },
      {
        heading: "Require approval for actions with outside consequences",
        bullets: [
          "Have the Bot prepare a draft and ask a person to approve publication.",
          "Have the Bot propose recipients and ask a person to approve sending.",
          "Have the Bot report possible deletions and ask a person to approve them.",
          "Have the Bot create a change plan and ask a person to approve production changes.",
          "Have the Bot identify financial or legal questions and send them to a qualified person.",
        ],
        sources: [{ label: "Official cron guide", href: official.cron }],
      },
      {
        heading: "Record what happened during each run",
        paragraphs: [
          "A useful routine records what it read, what it produced, what it changed, and which decision it left for a person. This record makes the result easier to review and compare with later runs.",
        ],
      },
    ],
  },
  {
    slug: "first-run-checklist",
    title: "The first-run checklist",
    summary:
      "Test with sample material before giving a Bot access to files, accounts, or messaging.",
    audience: "Practical operators",
    readTime: "4 min",
    updated: "2026-08-25",
    sections: [
      {
        heading: "Use a realistic task with sample material",
        bullets: [
          "Use copies or made-up sample data.",
          "Keep network and messaging access off unless the test requires it.",
          "Ask the Bot to describe the files, tools, and approvals it expects to use.",
          "Verify the claimed output exists and can be opened.",
          "Check logs and the destination directory for unrequested changes.",
          "Record the Hermes version, operating system, exact project version, test date, and result.",
        ],
      },
      {
        heading: "Record failed tests",
        paragraphs: [
          "Stop when setup is confusing, a tool is missing, a credential request is surprising, or the result differs from the README. Record the problem and resolve it before adding more access.",
        ],
      },
      {
        heading: "Add one type of access at a time",
        paragraphs: [
          "Add one type of access at a time. Repeat the test when the source, AI model, tools, outside connections, or schedule changes.",
        ],
        sources: [{ label: "Official Hermes security guide", href: official.security }],
      },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}
