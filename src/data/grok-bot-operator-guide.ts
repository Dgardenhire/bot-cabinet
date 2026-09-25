export type GrokOperatorSection = {
  number: string;
  title: string;
  bullets: string[];
};

export const GROK_OPERATOR_UPDATED = "September 24, 2026";

export const GROK_OPERATOR_SECTIONS: GrokOperatorSection[] = [
  {
    number: "01",
    title: "Choose the right shape",
    bullets: [
      "Use a Bot for one continuing job and its working context.",
      "Use a Skill for a method you want to repeat.",
      "Use a Routine only when a tested method needs a schedule or event trigger.",
      "Do the task once, correct it, save the method, then automate it.",
    ],
  },
  {
    number: "02",
    title: "Give the work a finish line",
    bullets: [
      "Name the result, the sources, the limits, the deliverable and the review point.",
      "Send a new message when you need to redirect work already in progress.",
      "Stop ends the current work; it does not undo actions already completed.",
      "Review drafts before sending, publishing, purchasing, deleting or changing production systems.",
    ],
  },
  {
    number: "03",
    title: "Protect accounts and files",
    bullets: [
      "Take control of the computer for passwords, passkeys, two-factor codes, CAPTCHAs and payment confirmation.",
      "Never paste passwords or one-time codes into ordinary chat.",
      "All of your Bots share one cloud computer, including its files, browser sessions and logins.",
      "Connect only what the job needs. Use narrow Ask first rules for consequential actions.",
    ],
  },
  {
    number: "04",
    title: "Add a Routine carefully",
    bullets: [
      "Confirm the owner, schedule, time zone, input, result, approval boundary and missing-source rule.",
      "A test run performs real work. Use safe inputs and keep write actions behind approval.",
      "A Bot can own up to 50 routines. Grok Bot keeps the 20 most recent run records for each routine.",
      "Pause a Routine when its website, connector or source format changes.",
    ],
  },
  {
    number: "05",
    title: "Use a group only when it helps",
    bullets: [
      "A group chat can include two to six Bots.",
      "Give the group one shared outcome and name the Bot that owns the next step.",
      "Use separate Bots when jobs need different roles or an independent check - not as a security boundary.",
      "For each handoff, state the outcome, sources, constraints, deliverable and review point.",
    ],
  },
  {
    number: "06",
    title: "Fix the smallest failing part",
    bullets: [
      "If a Routine misses a run, check whether it is enabled, who owns it, its time zone, its source and its run history.",
      "If a private Skill is missing, check Marketplace, then Your plugins, then Manage plugins and skills.",
      "If computer work stalls, retry the step before rebuilding the computer.",
      "Change one instruction, rerun the same safe test and keep the result that proves the change.",
    ],
  },
];

export const GROK_OPERATOR_SHORTCUTS = [
  ["Cmd/Ctrl+K", "Search or open the command palette"],
  ["Cmd/Ctrl+N", "Start a new Bot or chat"],
  ["Cmd/Ctrl+F", "Find in the current chat"],
  ["Cmd/Ctrl+B", "Compact the sidebar"],
  ["Cmd/Ctrl+Shift+F", "Search Bots"],
  ["/", "Choose a Skill"],
  ["@", "Mention a Bot, group, Routine or connector"],
] as const;

export const GROK_OPERATOR_SOURCES = [
  { label: "Grok Bot overview", href: "https://docs.x.ai/grok-bot/overview" },
  { label: "Skills and Routines", href: "https://docs.x.ai/grok-bot/skills-routines-and-automations" },
  { label: "Approvals, security and privacy", href: "https://docs.x.ai/grok-bot/approvals-security-and-privacy" },
  { label: "Chat and collaboration", href: "https://docs.x.ai/grok-bot/chat-and-collaboration" },
  { label: "Troubleshooting", href: "https://docs.x.ai/grok-bot/troubleshooting" },
] as const;
