# Bot Cabinet

Bot Cabinet is a free, independent guide to finding, understanding, and building useful Bots. Its first collection, the Hermes Bot Registry, focuses on Hermes Agent Bot Mode. It helps people find Bots by job, follow practical setup steps, and examine selected public Hermes projects.

A Hermes Bot is an agent profile with its own role and settings. A profile distribution is a public package that shares profile files with other Hermes users.

Bot Cabinet and the Hermes Bot Registry are independent from Nous Research. Listings do not provide a security guarantee or an endorsement from Nous Research.

## What the site includes

- Sixteen practical Hermes Bots with example requests, expected results, approval points, and source-package downloads
- Seventeen everyday use cases that show which Bots to use and provide a copyable message for each step
- Bot Lab, a browser-based builder with optional AI suggestions, role instructions, and a downloadable Bot Blueprint
- A small directory of public community projects with source links and clearly labeled review information
- Plain-English guides to Bot Mode, profile packages, first tests, and installation checks
- Dark and light layouts with a persistent theme control

## Current review limits

Bot Cabinet currently has one editor and does not provide human technical review. The project contains an automated source scanner for local testing, but the public submission and publication system is not open yet. Selected community pages therefore show source and review information without presenting an install button.

Hermes does not publish install counts for these projects. The Registry does not display estimated or invented counts.

Starter downloads are readable source packages. They are not one-click Hermes Desktop imports. Each page explains how to copy the role into a new Bot through Hermes Desktop.

## Run the site locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Run the checks

```bash
npm run lint
npx tsc --noEmit
npm test
npm run test:intake
npm run test:edge
npm run build
```

`npm run build` creates the static website in `out/`.
Run `npm start` after a build to preview that static export.

## Turn on Bot Lab AI suggestions

The website remains a static export. Its AI button calls a Supabase Edge Function,
so the Anthropic API key stays on the server. A build without the public function
URL disables the AI button and keeps the separately labeled basic template available.

1. Create or link a Supabase project.
2. Apply `supabase/migrations/20260825000000_bot_blueprint_rate_limits.sql`.
3. Deploy `supabase/functions/bot-blueprint` with JWT verification disabled, as set in `supabase/config.toml`.
4. Set the server-side Edge Function secret `ANTHROPIC_API_KEY` in Supabase. The
   function already uses Bot Cabinet's production and local origins, Claude Haiku
   4.5, a limit of 10 requests per person per day, and a site-wide limit of 50
   requests per day. Optional overrides are `AI_ENABLED`,
   `BOT_BLUEPRINT_RATE_SALT`, `BOT_BLUEPRINT_ALLOWED_ORIGINS`,
   `BOT_BLUEPRINT_MODEL`, `BOT_BLUEPRINT_DAILY_LIMIT`, and
   `BOT_BLUEPRINT_GLOBAL_DAILY_LIMIT`.
5. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BOT_BLUEPRINT_API_URL` to the deployed function URL.
6. Build the static site again so the public endpoint is included in the browser bundle.

Keep `ANTHROPIC_API_KEY`, any custom `BOT_BLUEPRINT_RATE_SALT`, and the Supabase
service-role key out of every `NEXT_PUBLIC_` variable. Before launch, start with no more than $10
in [prepaid Anthropic usage credits](https://support.anthropic.com/en/articles/8977456-how-do-i-pay-for-my-api-usage)
and leave automatic reload off. Treat that balance as the $10 launch-month provider
cap, and add more only after reviewing actual use. Set `AI_ENABLED=false` to stop new
AI requests without rebuilding the site.

The browser sends only the Bot name and job description. The function rejects extra
request fields, validates the generated JSON before returning it, fills only empty form
fields, enforces exact-origin CORS and daily request limits, and returns generic errors.
It does not give the model tools or browsing access. The function code does not log
prompt text.
Anthropic processes the Bot name and job description to create the suggestions.
Review [Anthropic's current API data retention information](https://privacy.anthropic.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)
before turning on the feature.

## Review policy

[docs/REVIEW-POLICY.md](docs/REVIEW-POLICY.md) explains what the automated source check reads, what it cannot establish, and why some projects remain unpublished.

## Project links

- [Bot Cabinet](https://botcabinet.com/)
- [Official Hermes Agent repository](https://github.com/NousResearch/hermes-agent)

## License

The source code is available under the [MIT License](LICENSE). The downloadable
starter Bot packages contain their own MIT license. Bot Cabinet's name, wordmark,
brand assets, photography, generated artwork, and personal images are not included
in that software license; see [ASSET-LICENSE.md](ASSET-LICENSE.md).
