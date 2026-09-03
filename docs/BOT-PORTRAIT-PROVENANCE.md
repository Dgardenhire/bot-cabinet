# Bot Portrait Studio provenance

Bot Cabinet's Portrait Studio collection contains 18 images: ten premium
portraits and eight classic portraits already used elsewhere on the site.

The first five premium portraits were created on August 25, 2026. The second
five were created on September 3, 2026. All ten were made with OpenAI's
built-in image generation, and the original PNGs retain Content Credentials
identifying OpenAI Media Service and `gpt-image` version `2.0`.

The shared art direction calls for friendly, clean, contemporary AI robots
with restrained Victorian-instrument details. It expressly excludes weapons,
excessive gears, fantasy costumes, and dystopian imagery.

## Premium portraits

| Portrait | Original SHA-256 |
| --- | --- |
| Navigator | `a7247608cf1ed45b26f7eb206e5cceb7a1b2b358ed33fca1470a1740f43e48e3` |
| Archivist | `6c340862b172ed8bde371e56cf4500628b3ce2761fee721292b200ceca74be91` |
| Mechanic | `6c59ffe090613b6342ef4697405a5107c5488edfaa2325306b3785700af5d335` |
| Diplomat | `14e12b7a29516b66af74eacba7ba8ff17420f7a8153510549e096182f66ef217` |
| Scout | `b3765e4bee7c6b71ab682778d26a05c7af2bdccb6f889edc2fb889985340d1ef` |
| Courier | `a9f0877d8a3eb11b9cbe9faddafcc9dc529940456434aad71f4efb229f5a51a2` |
| Steward | `5104f638a6dd5ea1294cbc119d7f31fd532248872437ca5d15dd721244bad794` |
| Scribe | `704de6e42fd38e2a5609adef651c87fd0a798bb07f7f50f6ff42d185dd478938` |
| Beacon | `93b6b5c236238d4031ad781b45aba3b2b2079d071da4c045cc48a5d5a53447b1` |
| Builder | `956dcb6bcc18f0e63de0016fe8d0464739fd1efe2d3f6e98879dc1c9d9bbdd96` |

## Classic portraits

The eight classic source PNGs retain embedded C2PA claims identifying
`fal-ai/flux-2-klein` and an algorithmically generated media source type.

| Portrait | Source file | Source SHA-256 |
| --- | --- | --- |
| Coder | `bot-coder.png` | `0e15f18c1d84c3c9967111f2067b967fc3114e54070980e76bb2007da97ee510` |
| Editor | `bot-editor.png` | `1bca9188cc9e106564686792f6b7cf33b09937e4a1e441cf5cf94607edaf96b7` |
| Operations | `bot-ops.png` | `ddf67e4c4f7127f5d4b33d5b7aaf2f84e8e15f8612cf3f2c9cdc855f9edcf314` |
| Planner | `bot-planner.png` | `bc7cc5c85920d6117e0523fc94272f29bce4cfe6affbcb28bfde7e2538ad5e8e` |
| Professor | `bot-professor.png` | `2a22c605d934c687225a4a7f6edbefc490b59bbc6ce352207cbdfc5f8ae0674b` |
| Researcher | `bot-researcher.png` | `28760fb56b537788322274a99715e80a620a2681963e02c231aedf7bde8a8175` |
| Classic Scout | `bot-scout.png` | `78bbff01438bfe5e3283db9a822e970cef590cad2c961aefc8d41c6e12773950` |
| Writer | `bot-writer.png` | `2b0429390198d487e056a7dfa5e883cebb43df142b811e945cb263bdf1227e10` |

`scripts/build-bot-portraits.mjs` verifies every recorded source hash, takes a
documented square crop from each 1024×1536 premium original, and produces:

- a 1024×1024 PNG for upload;
- a 256×256 PNG for smaller profile-image uses; and
- a 560×560 WebP used only as the website preview.

The premium crops, compressed classic downloads, and website previews do not
retain the original cryptographic Content Credentials. They are documented
derivatives, not signed originals.
