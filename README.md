# Bot Cabinet

Bot Cabinet is a free, independent guide to finding, understanding, and building useful Bots. Its first collection, the Hermes Bot Registry, focuses on Hermes Agent Bot Mode. It helps people find Bots by job, follow practical setup steps, and examine selected public Hermes projects.

A Hermes Bot is an agent profile with its own role and settings. A profile distribution is a public package that shares profile files with other Hermes users.

Bot Cabinet and the Hermes Bot Registry are independent from Nous Research. Listings do not provide a security guarantee or an endorsement from Nous Research.

## What the site includes

- Sixteen practical Hermes Bots with example requests, expected results, approval points, and importable Hermes profile downloads
- A portable Markdown and JSON recipe for each starter Bot, plus a separate Grok Bot build brief
- Seventeen everyday use cases that show which Bots to use and provide a copyable message for each step
- Bot Lab, a browser-based builder with optional AI suggestions, an importable Hermes profile, role instructions, a designed PDF, and an editable Markdown plan
- A small directory of public community projects with source links and clearly labeled review information
- Plain-English guides to Bot Mode, profile packages, first tests, and installation checks
- Dark and light layouts with a persistent theme control

## Current review limits

Bot Cabinet currently has one editor and does not provide human technical review. The project contains an automated source scanner for local testing, but the public submission and publication system is not open yet. Selected community pages therefore show source and review information without presenting an install button.

Hermes does not publish install counts for these projects. The Registry does not display estimated or invented counts.

Starter pages provide a `.tar.gz` Hermes profile archive for import and a ZIP containing the same readable source files. Each page also provides a one-line terminal import command.

## Portable Bots and Grok Bot

Each starter Bot has one platform-neutral recipe containing its job, boundaries,
first task, review checkpoint, Skill recipe, Routine recipe, and Bot Passport.
Bot Cabinet then supplies separate setup paths:

- Hermes Agent has a downloadable profile distribution and readable source archive.
- Grok Bot has a prepared build brief that follows the documented profile, Skill,
  Routine, and public-sharing model.

The Grok Bot adaptations have not yet completed runtime testing. They are labeled
`Prepared · test pending` on the site. Their current scope is a manual build path;
package compatibility and one-click import remain outside that scope. Existing Grok brief URLs remain available at
`/downloads/grok-bot-templates/<bot>.md`; the complete portable packs live at
`/downloads/portable-bot-packs/<bot>.md` and `.json`.

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

## Bot Lab AI suggestions

Bot Lab sends the Bot name and job description to a server-side function. Provider
credentials stay on the server and are never included in the public website. The
endpoint validates input and output, limits requests, and returns generic errors.
Without a configured endpoint, Bot Lab keeps its separately labeled basic template.

Self-hosted copies can use `.env.example` for the public endpoint setting. Keep every
provider credential and server secret outside the repository and outside all
`NEXT_PUBLIC_` variables.

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
