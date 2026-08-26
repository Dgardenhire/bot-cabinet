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

Bot Cabinet currently has one editor and does not provide human technical review. It uses a limited automated source check, but the public submission and publication system is not open yet. Selected community pages therefore show source and review information without presenting an install button.

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
npm run build
```

`npm run build` creates the static website in `out/`.
Run `npm start` after a build to preview that static export.

## Bot Lab AI suggestions

Bot Lab can optionally request AI-assisted suggestions from Bot Cabinet's server-side
service. Provider credentials are not included in the browser or this repository. A
local build without a configured service endpoint continues to provide the basic
template builder.

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
