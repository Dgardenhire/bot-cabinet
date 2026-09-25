export type AgentWatchSource = {
  name: string;
  href: string;
  group: "Official marketplaces" | "Bot directories" | "Repositories and releases" | "Agent products" | "Agent infrastructure";
  coverage: "Live listings" | "Checked for each update" | "Guide available" | "Release feed";
};

export const AGENT_WATCH_SOURCES: AgentWatchSource[] = [
  { name: "Grok Bot Marketplace", href: "https://x.ai/bot/marketplace", group: "Official marketplaces", coverage: "Live listings" },
  { name: "Grok Bot guides and use cases", href: "https://x.ai/bot/guides", group: "Official marketplaces", coverage: "Guide available" },
  { name: "My Bot Farm", href: "https://mybot.farm/catalog", group: "Bot directories", coverage: "Live listings" },
  { name: "GrokHub", href: "https://www.grokhub.io/", group: "Bot directories", coverage: "Live listings" },
  { name: "BotDirectory", href: "https://botdirectory.ai/", group: "Bot directories", coverage: "Live listings" },
  { name: "GrokBots.best", href: "https://grokbots.best/", group: "Bot directories", coverage: "Live listings" },
  { name: "grokbot.dev", href: "https://grokbot.dev/marketplace/", group: "Bot directories", coverage: "Live listings" },
  { name: "really.bot", href: "https://really.bot/", group: "Bot directories", coverage: "Live listings" },
  { name: "FreeBots", href: "https://freebots.lol/", group: "Bot directories", coverage: "Checked for each update" },
  { name: "Rakazo", href: "https://rakazo.com/", group: "Agent products", coverage: "Checked for each update" },
  { name: "Muse at Work", href: "https://museatwork.app/", group: "Bot directories", coverage: "Live listings" },
  { name: "OpenBot plugins", href: "https://openbot.run/plugins", group: "Bot directories", coverage: "Checked for each update" },
  { name: "Grok Bot Field Notes", href: "https://github.com/unicodef1wn/grokbot-field-notes", group: "Repositories and releases", coverage: "Live listings" },
  { name: "Hermes Agent releases", href: "https://github.com/NousResearch/hermes-agent/releases", group: "Repositories and releases", coverage: "Release feed" },
  { name: "OpenClaw releases", href: "https://github.com/openclaw/openclaw/releases", group: "Repositories and releases", coverage: "Release feed" },
  { name: "OpenBot releases", href: "https://github.com/nightly-labs/openbot/releases", group: "Repositories and releases", coverage: "Release feed" },
  { name: "Hermes Atlas", href: "https://hermesatlas.com/", group: "Repositories and releases", coverage: "Checked for each update" },
  { name: "GitHub agent repositories", href: "https://github.com/topics/ai-agent", group: "Repositories and releases", coverage: "Live listings" },
  { name: "GitLab agent repositories", href: "https://gitlab.com/explore/projects/topics/ai-agent", group: "Repositories and releases", coverage: "Live listings" },
  { name: "Muse", href: "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/", group: "Agent products", coverage: "Checked for each update" },
  { name: "Instinct", href: "https://instinct.com/", group: "Agent products", coverage: "Checked for each update" },
  { name: "Gemini Spark", href: "https://gemini.google/overview/agent/spark/", group: "Agent products", coverage: "Checked for each update" },
  { name: "Nasiko", href: "https://github.com/Nasiko-Labs/nasiko", group: "Agent infrastructure", coverage: "Checked for each update" },
];

export const AGENT_WATCH_SOURCE_GROUPS = [
  "Official marketplaces",
  "Bot directories",
  "Repositories and releases",
  "Agent products",
  "Agent infrastructure",
] as const;
