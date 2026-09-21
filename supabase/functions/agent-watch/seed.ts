// Generated from src/data/agent-watch.ts. Do not edit by hand.
import type { AgentWatchItem } from "./core.ts";

export const AGENT_WATCH_SEED: AgentWatchItem[] = [
  {
    "slug": "bounce-rate-is-not-useful-action",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-10-04",
    "title": "A bounce can still contain a useful action",
    "signal": "Vercel counts a visit as a bounce when a person leaves without opening a second page. A person can still download a Bot, start setup or report a result and be counted as a bounce.",
    "evidence": "observed",
    "whyItMatters": "A low bounce rate does not prove the site was useful. A high bounce rate does not prove a focused guide or download page failed. Bot Cabinet also needs to count useful actions and finished work.",
    "cabinetResponse": "Added separate counts for downloads, setup starts, reported results, problems, return visits and repeat runs. This gives Bot Cabinet a clearer picture than bounce rate alone.",
    "responseStatus": "published",
    "limits": "The current 51% bounce rate comes from a short time period. It does not show whether people read carefully, finished a task or came back to use the same Bot again.",
    "sources": [
      {
        "label": "Vercel Web Analytics: bounce-rate calculation",
        "href": "https://vercel.com/docs/analytics#bounce-rate"
      },
      {
        "label": "Vercel Web Analytics: custom events",
        "href": "https://vercel.com/docs/analytics/custom-events"
      }
    ],
    "cabinetLinks": [
      {
        "label": "Run the first-user walkthrough",
        "href": "/start"
      },
      {
        "label": "Open your Bot workbench",
        "href": "/workbench"
      }
    ]
  },
  {
    "slug": "repeat-use-not-return-visits",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-10-04",
    "title": "A return visit is not the same as repeat usefulness",
    "signal": "Reports about AI agents often count very small actions. A download, first use or return visit does not prove the same tool can keep doing useful work.",
    "evidence": "observed",
    "whyItMatters": "Bot Cabinet needs to learn whether a person finishes a real job, uses the same Bot again and gets a useful result—not just whether a page opened or a file downloaded.",
    "cabinetResponse": "Added a private Three-Run Trial. It helps one person compare three attempts at the same job, including edits, supervision, cost and whether the work recovered after an interruption. Names and notes stay in the browser and are not sent to analytics.",
    "responseStatus": "published",
    "limits": "No one has submitted a live result yet. The trial records one person's own answers after three attempts. It does not prove the work is good for everyone, always reliable or worth paying for.",
    "sources": [
      {
        "label": "Microsoft WorkLab: active-agent measurement",
        "href": "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization"
      },
      {
        "label": "Anthropic: evaluating agents across repeated trials",
        "href": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
      }
    ],
    "cabinetLinks": [
      {
        "label": "Run the first-user walkthrough",
        "href": "/start"
      },
      {
        "label": "Open the Three-Run Trial",
        "href": "/workbench"
      }
    ]
  },
  {
    "slug": "personal-agents-move-into-background",
    "observedOn": "2026-09-20",
    "reviewAgainBy": "2026-10-04",
    "title": "Personal agents are moving into background work",
    "signal": "Muse and Gemini Spark describe agents that keep working after the conversation ends. Instinct describes an assistant reached by text or phone that connects to applications and devices.",
    "evidence": "provider-claim",
    "whyItMatters": "The important change is not another chat screen. These services want to handle continuing jobs, use connected information, follow schedules and ask for approval. Bot Cabinet should help people compare the real job, access, controls and proof.",
    "cabinetResponse": "Published a guide that starts with the job a person wants done, then asks what each service can access, how it asks for approval and what proof it provides. Bot Cabinet still needs hands-on comparisons before recommending one service for a specific job.",
    "responseStatus": "published",
    "limits": "Bot Cabinet read the linked company pages but has not tested current access, reliability, account connections, prices or how often the work is completed.",
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
    "cabinetResponse": "Published an attributed use case and setup guide. It points to the creator's Grok Bot and explains what would need to be checked before trying the idea with Hermes, Muse, Instinct or another service.",
    "responseStatus": "published",
    "limits": "Bot Cabinet checked the public listing, but has not run the original Bot from start to finish. The other setup ideas and automatic printing have not been tested.",
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
    "title": "Personal agents are splitting into different jobs",
    "signal": "Ollie says it helps a family stay organized. Wajo says its agent can handle calls, vendors, bookings and approved purchases. Town says it learns how a person works and helps across connected business tools.",
    "evidence": "provider-claim",
    "whyItMatters": "Calling all three a personal assistant hides the real choice. One helps a family coordinate, one handles real-world errands, and one learns how a person works. Each needs different access and approval rules.",
    "cabinetResponse": "Added these services to the agent-selection guide and compared their jobs with Home Admin, Personal Planning Desk and Small-Business Admin Desk. Bot Cabinet did not add a duplicate Bot simply because a company used a new name.",
    "responseStatus": "published",
    "limits": "Bot Cabinet read the company pages but has not opened accounts, connected personal information, spent money, placed calls or purchases, or tested the same job several times. Prices, access and connections can change.",
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
    "whyItMatters": "The useful part is often a clear way of doing a job, not a fancy title. Bot Cabinet should find good ideas, credit their creators, check setup and permissions, and adapt an idea only when another AI service can actually support it.",
    "cabinetResponse": "A new Keeper checker can record new or changed marketplace listings for a person to review. It also points out ideas that may overlap with Bot Cabinet. It does not publish or reject anything by itself.",
    "responseStatus": "testing",
    "limits": "The checker and private review list passed tests on the Mac, but are not installed on the cloud Keeper. X search is not connected. A marketplace listing does not prove people use or value a Bot.",
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
    "whyItMatters": "A reusable set of instructions may work in more places than a Bot made for one service. Bot Cabinet should make those instructions easy to find and test them with each service before saying they work there.",
    "cabinetResponse": "Each Bot Pack now includes a SKILL.md file and shows it beside the readable Markdown and JSON files. Visitors are told to review permissions and test the file with the AI service they choose.",
    "responseStatus": "published",
    "limits": "Bot Cabinet has not listed these files in another skill directory, tested them with every service named by skills.sh or measured repeat use. A Hermes test does not prove the file works with another service.",
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
    "whyItMatters": "A download that worked once can later become outdated. Bot Cabinet needs version numbers, dated test notes and new tests after an important outside update.",
    "cabinetResponse": "A Keeper checker can watch both official release feeds and add a new update to a private review list. A person still has to decide whether a Bot needs another test.",
    "responseStatus": "testing",
    "limits": "The release checker passed tests on the Mac, but is not installed on the cloud Keeper. Bot Cabinet will not say a package still works until someone checks it.",
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
