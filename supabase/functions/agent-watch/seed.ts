// Generated from src/data/agent-watch.ts. Do not edit by hand.
import type { AgentWatchItem } from "./core.ts";

export const AGENT_WATCH_SEED: AgentWatchItem[] = [
  {
    "slug": "personal-agents-move-into-background",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-10-04",
    "title": "Personal agents are moving into background work",
    "signal": "Muse and Gemini Spark describe agents that keep working after the conversation ends. Instinct describes an assistant reached by text or phone that connects to applications and devices.",
    "evidence": "provider-claim",
    "whyItMatters": "The important change is not another chat screen. These services want to handle continuing jobs, use connected information, follow schedules and ask for approval. The useful comparison is the job, access, controls and proof—not the brand name.",
    "cabinetResponse": "Choose one small recurring job and compare the services by what information they can use, what actions they can take, how they ask permission, what they cost, and how they show that the work was completed.",
    "responseStatus": "published",
    "limits": "Not yet tested here: current access, reliability, account connections, prices or how often the work is completed.",
    "sources": [
      {
        "label": "Meta: Introducing Muse",
        "href": "https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/"
      },
      {
        "label": "Instinct product page",
        "href": "https://instinct.com/"
      },
      {
        "label": "Google: Gemini Spark",
        "href": "https://gemini.google/overview/agent/spark/"
      }
    ],
    "cabinetLinks": [
      {
        "label": "Which agent path fits your work?",
        "href": "/guides/choose-your-agent-path"
      }
    ]
  },
  {
    "slug": "morning-newspaper-is-a-finished-ritual",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-10-04",
    "title": "The Morning Newspaper turns agent work into a finished ritual",
    "signal": "Karen X. Cheng's Grok Bot listing describes a personalized newspaper assembled from email and calendar and printed while the user sleeps.",
    "evidence": "observed",
    "whyItMatters": "This is more than a general briefing Bot. It uses personal information, runs on a schedule, chooses a short set of items and makes something that can be read away from a screen.",
    "cabinetResponse": "Read the original Grok Bot listing, then try one manual edition with made-up or selected information. Check every item before connecting private accounts, adding a schedule, or sending anything to a printer.",
    "responseStatus": "published",
    "limits": "Not yet tested here: a complete run of the original Bot, the other setup ideas or automatic printing.",
    "sources": [
      {
        "label": "Karen X. Cheng: The Morning Newspaper",
        "href": "https://x.ai/bot/marketplace/bots/the-morning-newspaper"
      }
    ],
    "cabinetLinks": [
      {
        "label": "Read the cross-platform guide",
        "href": "/guides/morning-newspaper-across-agents"
      },
      {
        "label": "Open the Cabinet use case",
        "href": "/use-cases/personal-morning-newspaper"
      }
    ]
  },
  {
    "slug": "personal-agents-are-splitting-by-job",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-09-27",
    "title": "New personal agents are choosing different kinds of work",
    "signal": "Ollie is presented as an organizer for families. Wajo's Fo is presented as an agent for phone calls, vendors, bookings and approved purchases. Town is designed to learn a person's working style across connected business tools.",
    "evidence": "provider-claim",
    "whyItMatters": "The label “personal assistant” hides important differences. Family coordination, real-world errands and help across business tools require different information, permissions and safeguards.",
    "cabinetResponse": "Begin with the job, not the brand. Decide whether you need family coordination, outside actions or help across work tools, then compare access, approvals, cost and a low-risk first test.",
    "responseStatus": "published",
    "limits": "Not yet tested here: account setup, personal-data connections, spending, calls, purchases or repeated runs of the same job. Prices, access and connections can change.",
    "sources": [
      {
        "label": "Ollie: family assistant",
        "href": "https://ollie.ai/"
      },
      {
        "label": "Wajo: Fo and action agents",
        "href": "https://wajo.ai/"
      },
      {
        "label": "Town: getting-started documentation",
        "href": "https://www.town.com/docs/getting-started"
      }
    ],
    "cabinetLinks": [
      {
        "label": "Compare agent paths by job",
        "href": "/guides/choose-your-agent-path"
      }
    ]
  },
  {
    "slug": "bot-marketplaces-are-becoming-workflow-libraries",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-09-27",
    "title": "Bot marketplaces are becoming libraries of useful routines",
    "signal": "The Grok Bot marketplace now includes many specific personal and work routines. Its guide explains that a shared template can include instructions, selected memories, skills and plugins without being an exact copy.",
    "evidence": "observed",
    "whyItMatters": "The useful part is often a clear way of doing a job, not a fancy title. A good adaptation credits the creator, checks the setup and permissions, and moves the idea only to a service that can actually support it.",
    "cabinetResponse": "Look for a specific routine that solves a real problem. Check the creator, required access and first-run instructions before using it. Adapt the idea to another service only when that service can perform the same job safely.",
    "responseStatus": "testing",
    "limits": "A marketplace listing does not prove that people use the Bot, that the instructions are safe, or that the routine works repeatedly. Not every linked listing has been tested.",
    "sources": [
      {
        "label": "Grok Bot Marketplace",
        "href": "https://x.ai/bot/marketplace"
      },
      {
        "label": "Grok Bot template guide",
        "href": "https://x.ai/bot/guides/templates-for-grok-bot"
      }
    ],
    "cabinetLinks": [
      {
        "label": "Read the Grok Bot guide",
        "href": "/platforms/grok-bot"
      }
    ]
  },
  {
    "slug": "skills-are-becoming-a-portable-unit",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-10-04",
    "title": "Agent Skills can carry instructions between services",
    "signal": "The Agent Skills format uses a file named SKILL.md to hold instructions. Skills.sh shares single skills and skill packs for several AI services. Its rankings count installs, not whether the skill keeps producing useful work.",
    "evidence": "observed",
    "whyItMatters": "A reusable set of instructions may work in more places than a Bot made for one service. But the instructions still need a separate test in each service before anyone can say they work there.",
    "cabinetResponse": "Open the SKILL.md file before installing it. Check its instructions and requested access, then run one low-risk test in the service you plan to use.",
    "responseStatus": "published",
    "limits": "Not yet tested here: every service named by skills.sh or repeated use across services. A Hermes test does not prove that the same file works somewhere else.",
    "sources": [
      {
        "label": "Agent Skills format specification",
        "href": "https://agentskills.io/specification"
      },
      {
        "label": "skills.sh documentation and measurement limits",
        "href": "https://www.skills.sh/docs"
      },
      {
        "label": "skills.sh supported-agent FAQ",
        "href": "https://www.skills.sh/docs/faq"
      }
    ],
    "cabinetLinks": [
      {
        "label": "Browse portable Bot Packs",
        "href": "/bots"
      }
    ]
  },
  {
    "slug": "open-agent-runtimes-keep-changing",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-09-27",
    "title": "Hermes and OpenClaw change too quickly for permanent “works with” labels",
    "signal": "Hermes Agent and OpenClaw both released several updates in September. Their public release pages show frequent changes to how they run, connect to other tools and fix problems.",
    "evidence": "observed",
    "whyItMatters": "A download that worked once can later become outdated. Useful compatibility notes need a version number, a test date and another test after an important runtime update.",
    "cabinetResponse": "Check the tested version and date before installing a Bot. After an important runtime update, repeat the Bot's first test before trusting it with recurring work or broader access.",
    "responseStatus": "testing",
    "limits": "Release notes do not show whether a particular Bot still works. A package should be treated as unconfirmed after a major runtime change until its first test is repeated.",
    "sources": [
      {
        "label": "Hermes Agent releases",
        "href": "https://github.com/NousResearch/hermes-agent/releases"
      },
      {
        "label": "OpenClaw releases",
        "href": "https://github.com/openclaw/openclaw/releases"
      }
    ]
  }
];
