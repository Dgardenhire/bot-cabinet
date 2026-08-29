import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";
import ts from "typescript";

const h = React.createElement;
const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "public/downloads/crew-kits");
const wordmarkImage = path.join(projectRoot, "public/brand/bot-cabinet-wordmark-dark-v1.png");
const pdfBuildDate = new Date("2026-08-29T00:00:00.000Z");

async function loadTsData(relativePath) {
  const source = await readFile(path.join(projectRoot, relativePath), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function("exports", "module", compiled)(compiledModule.exports, compiledModule);
  return compiledModule.exports;
}

const { CREW_KITS: kits } = await loadTsData("src/data/crew-kits.ts");
const { STARTER_BOTS: starterBots } = await loadTsData("src/data/starter-bots.ts");
const botNames = new Map(starterBots.map((bot) => [bot.slug, bot.name]));

const C = {
  charcoal: "#111513",
  charcoalSoft: "#252A27",
  cream: "#F6F0E3",
  paper: "#FFFCF6",
  brass: "#B9842E",
  brassLight: "#D7B267",
  brassPale: "#EEE0BF",
  ink: "#27231D",
  muted: "#6B6459",
  green: "#466A55",
  greenPale: "#E6EFE7",
  amber: "#946D28",
  amberPale: "#F6EBD3",
  red: "#8A4D42",
  redPale: "#F3E4E0",
  line: "#D8CBB3",
  white: "#FFFFFF",
};

Font.registerHyphenationCallback((word) => {
  if (word.length <= 28) return [word];
  return word.match(/.{1,16}/g) ?? [word];
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 62,
    paddingRight: 44,
    paddingBottom: 54,
    paddingLeft: 44,
    backgroundColor: C.cream,
    color: C.ink,
    fontFamily: "Helvetica",
    fontSize: 9.4,
    lineHeight: 1.45,
  },
  cover: { position: "relative", backgroundColor: C.charcoal, color: C.cream },
  coverImage: {
    position: "absolute", top: 0, right: 0, bottom: 0, left: 0, width: "100%", height: "100%",
    objectFit: "cover", objectPosition: "center",
  },
  coverShade: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(7, 11, 10, 0.30)" },
  coverField: {
    position: "absolute", top: 0, bottom: 0, left: 0, width: 392,
    backgroundColor: "rgba(10, 17, 15, 0.92)", borderRightWidth: 1, borderRightColor: "rgba(215, 178, 103, 0.28)",
  },
  coverBlueprintVertical: { position: "absolute", top: 0, bottom: 0, left: 27, width: 1, backgroundColor: "rgba(215, 178, 103, 0.08)" },
  coverBlueprintHorizontal: { position: "absolute", top: 126, left: 0, width: 392, height: 1, backgroundColor: "rgba(215, 178, 103, 0.08)" },
  coverContent: { position: "absolute", top: 48, right: 245, bottom: 54, left: 48 },
  coverWordmark: { width: 205, height: 43.5, objectFit: "contain" },
  coverProject: { marginTop: 7, color: "#D9E0DB", fontFamily: "Courier-Bold", fontSize: 7.4, letterSpacing: 1.15 },
  coverNumberPlate: {
    position: "absolute", top: 42, right: 34, width: 90, paddingTop: 10, paddingRight: 10, paddingBottom: 10, paddingLeft: 10,
    backgroundColor: "rgba(10, 17, 15, 0.82)", borderWidth: 1, borderColor: "rgba(215, 178, 103, 0.72)",
  },
  coverNumberLabel: { color: C.brassLight, fontFamily: "Courier-Bold", fontSize: 6.8, letterSpacing: 1 },
  coverNumberValue: { marginTop: 3, color: C.cream, fontFamily: "Times-Roman", fontSize: 20 },
  coverKicker: { marginTop: 27, color: C.brassLight, fontFamily: "Courier", fontSize: 8.4, letterSpacing: 1.7 },
  coverRule: { width: 82, height: 2, marginTop: 17, marginBottom: 34, backgroundColor: C.brassLight },
  coverTitle: { color: C.cream, fontFamily: "Times-Roman", fontSize: 37, lineHeight: 1.02 },
  coverPromise: { marginTop: 18, maxWidth: 300, color: "#D9E0DB", fontSize: 10.7, lineHeight: 1.55 },
  coverManifest: {
    width: 294, marginTop: 30, paddingTop: 13, paddingRight: 13, paddingBottom: 13, paddingLeft: 13,
    borderWidth: 1, borderColor: "rgba(215, 178, 103, 0.50)", backgroundColor: "rgba(18, 30, 26, 0.72)",
  },
  coverManifestLabel: { color: C.brassLight, fontFamily: "Courier-Bold", fontSize: 7.4, letterSpacing: 1.15 },
  statRow: { display: "flex", flexDirection: "row", marginTop: 11 },
  stat: { flex: 1, paddingRight: 7, borderRightWidth: 1, borderRightColor: "rgba(215, 178, 103, 0.28)" },
  statLast: { flex: 1, paddingLeft: 10 },
  statMiddle: { flex: 1, paddingRight: 8, paddingLeft: 10, borderRightWidth: 1, borderRightColor: "rgba(215, 178, 103, 0.28)" },
  statNumber: { color: C.cream, fontFamily: "Times-Roman", fontSize: 20 },
  statLabel: { marginTop: 3, color: "#B8C3BD", fontFamily: "Courier-Bold", fontSize: 6.2, letterSpacing: 0.65 },
  coverAudience: { width: 294, marginTop: 18, paddingTop: 11, borderTopWidth: 1, borderTopColor: "rgba(215, 178, 103, 0.28)" },
  coverAudienceLabel: { color: C.brassLight, fontFamily: "Courier-Bold", fontSize: 6.8, letterSpacing: 1 },
  coverAudienceText: { marginTop: 5, color: "#D9E0DB", fontSize: 8.6, lineHeight: 1.4 },
  coverFooter: {
    position: "absolute", right: 245, bottom: 54, left: 48, paddingTop: 11,
    borderTopWidth: 1, borderTopColor: "rgba(215, 178, 103, 0.34)", color: "#B8C3BD", fontFamily: "Courier", fontSize: 7.3, lineHeight: 1.45,
  },
  header: {
    position: "absolute", top: 23, right: 44, left: 44, display: "flex", flexDirection: "row",
    justifyContent: "space-between", paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.line,
    color: C.muted, fontFamily: "Courier-Bold", fontSize: 7, letterSpacing: 0.7,
  },
  footer: {
    position: "absolute", right: 44, bottom: 22, left: 44, display: "flex", flexDirection: "row",
    justifyContent: "space-between", paddingTop: 8, borderTopWidth: 1, borderTopColor: C.line,
    color: C.muted, fontFamily: "Courier", fontSize: 7,
  },
  pageKicker: { color: C.brass, fontFamily: "Courier-Bold", fontSize: 8, letterSpacing: 1.5, marginBottom: 7 },
  pageTitle: { color: C.charcoal, fontFamily: "Times-Bold", fontSize: 26, lineHeight: 1.04, marginBottom: 8 },
  pageDeck: { maxWidth: 475, color: C.muted, fontSize: 10, lineHeight: 1.5, marginBottom: 18 },
  ornamentRow: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 18 },
  ornamentDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.brass },
  ornamentLine: { flex: 1, height: 1, backgroundColor: C.line },
  twoCol: { display: "flex", flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  roleCard: { marginBottom: 10, padding: 11, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line },
  roleTop: { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: 6 },
  number: { width: 24, height: 24, paddingTop: 5, textAlign: "center", borderRadius: 12, backgroundColor: C.brass, color: C.white, fontFamily: "Courier-Bold", fontSize: 8 },
  roleName: { marginLeft: 8, color: C.charcoal, fontFamily: "Times-Bold", fontSize: 14 },
  roleBody: { color: C.muted, fontSize: 8.7 },
  roleLink: { marginTop: 6, color: C.brass, fontFamily: "Courier-Bold", fontSize: 7.2, textDecoration: "none" },
  workflowCard: { marginBottom: 11, padding: 12, backgroundColor: C.paper, borderLeftWidth: 4, borderLeftColor: C.brass },
  workflowTitle: { color: C.charcoal, fontFamily: "Times-Bold", fontSize: 13, marginBottom: 4 },
  workflowBody: { color: C.muted, fontSize: 8.8 },
  workflowLink: { marginTop: 6, color: C.brass, fontFamily: "Courier-Bold", fontSize: 7.2, textDecoration: "none" },
  timeline: { paddingLeft: 6 },
  timelineItem: { position: "relative", marginBottom: 9, paddingLeft: 25, paddingBottom: 8, borderLeftWidth: 1, borderLeftColor: C.brassLight },
  timelineDot: { position: "absolute", left: -5, top: 1, width: 9, height: 9, borderRadius: 5, backgroundColor: C.brass },
  timelineTiming: { color: C.brass, fontFamily: "Courier-Bold", fontSize: 7.3, letterSpacing: 0.7 },
  timelineAction: { marginTop: 3, color: C.charcoal, fontFamily: "Helvetica-Bold", fontSize: 9 },
  timelineOwner: { marginTop: 2, color: C.muted, fontSize: 7.8 },
  passportBand: { display: "flex", flexDirection: "row", gap: 9, marginBottom: 14 },
  passportCard: { flex: 1, minHeight: 250, padding: 12, borderWidth: 1 },
  allowed: { backgroundColor: C.greenPale, borderColor: C.green },
  approval: { backgroundColor: C.amberPale, borderColor: C.amber },
  prohibited: { backgroundColor: C.redPale, borderColor: C.red },
  passportLabel: { fontFamily: "Courier-Bold", fontSize: 7, letterSpacing: 0.8, marginBottom: 7 },
  passportTitle: { color: C.charcoal, fontFamily: "Times-Bold", fontSize: 14, marginBottom: 8 },
  listItem: { display: "flex", flexDirection: "row", marginBottom: 6 },
  bullet: { width: 11, color: C.brass, fontFamily: "Courier-Bold" },
  listText: { flex: 1, color: C.ink, fontSize: 8.4 },
  noteBox: { padding: 13, backgroundColor: C.charcoalSoft, color: C.cream, borderLeftWidth: 4, borderLeftColor: C.brass },
  noteTitle: { color: C.brassLight, fontFamily: "Courier-Bold", fontSize: 7.4, letterSpacing: 0.9, marginBottom: 7 },
  noteText: { color: C.cream, fontSize: 8.3, marginBottom: 4 },
  sectionCard: { marginBottom: 12, padding: 12, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line },
  sectionTitle: { color: C.charcoal, fontFamily: "Times-Bold", fontSize: 15, marginBottom: 8 },
  checkItem: { display: "flex", flexDirection: "row", marginBottom: 6 },
  checkbox: { width: 11, height: 11, marginRight: 7, borderWidth: 1, borderColor: C.brass },
  checkText: { flex: 1, fontSize: 8.6 },
  step: { display: "flex", flexDirection: "row", marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.line },
  stepNum: { width: 25, color: C.brass, fontFamily: "Times-Bold", fontSize: 14 },
  stepText: { flex: 1, color: C.ink, fontSize: 8.7 },
  closing: { marginTop: 8, padding: 16, backgroundColor: C.brassPale, borderWidth: 1, borderColor: C.brass },
  closingTitle: { color: C.charcoal, fontFamily: "Times-Bold", fontSize: 17, marginBottom: 6 },
  closingText: { color: C.muted, fontSize: 9 },
  closingLink: { marginTop: 8, color: C.brass, fontFamily: "Courier-Bold", fontSize: 8, textDecoration: "none" },
});

function PageFrame({ kit, children }) {
  return h(React.Fragment, null,
    h(View, { style: styles.header, fixed: true },
      h(Text, null, "BOT CABINET / CREW KIT"),
      h(Text, null, kit.name.toUpperCase()),
    ),
    children,
    h(View, { style: styles.footer, fixed: true },
      h(Text, null, "A LINCHPIN PROJECT"),
      h(Text, { render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}` }),
    ),
  );
}

function Ornament() {
  return h(View, { style: styles.ornamentRow },
    h(View, { style: styles.ornamentDot }), h(View, { style: styles.ornamentLine }),
    h(View, { style: styles.ornamentDot }), h(View, { style: styles.ornamentLine }),
    h(View, { style: styles.ornamentDot }),
  );
}

function Bullets({ items }) {
  return items.map((item) => h(View, { style: styles.listItem, key: item },
    h(Text, { style: styles.bullet }, "•"), h(Text, { style: styles.listText }, item),
  ));
}

function CrewKitPdf({ kit }) {
  const kitUrl = `https://botcabinet.com/crew-kits/${kit.slug}/`;
  const coverImage = path.join(projectRoot, `public/crew-kits/pdf-covers/${kit.slug}.jpg`);
  const kitNumber = kit.eyebrow.replace("Complete Crew Kit ", "");
  return h(Document, {
    title: `${kit.name} Crew Kit`,
    author: "Bot Cabinet / LINCHPIN",
    subject: kit.promise,
    creationDate: pdfBuildDate,
    modificationDate: pdfBuildDate,
  },
    h(Page, { size: "LETTER", style: styles.cover },
      h(Image, { src: coverImage, style: styles.coverImage }),
      h(View, { style: styles.coverShade }),
      h(View, { style: styles.coverField }),
      h(View, { style: styles.coverBlueprintVertical }),
      h(View, { style: styles.coverBlueprintHorizontal }),
      h(View, { style: styles.coverNumberPlate },
        h(Text, { style: styles.coverNumberLabel }, "CREW DOSSIER"),
        h(Text, { style: styles.coverNumberValue }, kitNumber),
      ),
      h(View, { style: styles.coverContent },
        h(Image, { src: wordmarkImage, style: styles.coverWordmark }),
        h(Text, { style: styles.coverProject }, "A LINCHPIN PROJECT"),
        h(Text, { style: styles.coverKicker }, `CREW KIT / STANDING BOT TEAM / CK-${kitNumber}`),
        h(View, { style: styles.coverRule }),
        h(Text, { style: styles.coverTitle }, kit.name),
        h(Text, { style: styles.coverPromise }, kit.promise),
        h(View, { style: styles.coverManifest },
          h(Text, { style: styles.coverManifestLabel }, "CREW MANIFEST"),
          h(View, { style: styles.statRow },
            h(View, { style: styles.stat }, h(Text, { style: styles.statNumber }, String(kit.roles.length)), h(Text, { style: styles.statLabel }, "SPECIALIST BOTS")),
            h(View, { style: styles.statMiddle }, h(Text, { style: styles.statNumber }, String(kit.workflows.length)), h(Text, { style: styles.statLabel }, "WORKFLOWS")),
            h(View, { style: styles.statLast }, h(Text, { style: styles.statNumber }, String(kit.operatingRhythm.length)), h(Text, { style: styles.statLabel }, "STAGES")),
          ),
        ),
        h(View, { style: styles.coverAudience },
          h(Text, { style: styles.coverAudienceLabel }, "BUILT FOR"),
          h(Text, { style: styles.coverAudienceText }, kit.audience),
        ),
      ),
      h(View, { style: styles.coverFooter },
        h(Text, null, "CREW MANIFEST / WORKFLOW MAP / CREW PASSPORT"),
        h(Text, null, "BOTCABINET.COM"),
      ),
    ),

    h(Page, { size: "LETTER", style: styles.page },
      h(PageFrame, { kit },
        h(Text, { style: styles.pageKicker }, "01 / ASSEMBLE THE CREW"),
        h(Text, { style: styles.pageTitle }, "One function, clear responsibilities"),
        h(Text, { style: styles.pageDeck }, kit.description),
        h(Ornament),
        h(View, { style: styles.twoCol },
          h(View, { style: styles.col }, kit.roles.filter((_, index) => index % 2 === 0).map((role, index) =>
            h(View, { style: styles.roleCard, key: role.botSlug },
              h(View, { style: styles.roleTop }, h(Text, { style: styles.number }, String(index * 2 + 1).padStart(2, "0")), h(Text, { style: styles.roleName }, botNames.get(role.botSlug) ?? role.botSlug)),
              h(Text, { style: styles.roleBody }, role.responsibility),
              h(Link, { style: styles.roleLink, src: `https://botcabinet.com/bots/${role.botSlug}/` }, "OPEN BOT PROFILE"),
            ),
          )),
          h(View, { style: styles.col }, kit.roles.filter((_, index) => index % 2 === 1).map((role, index) =>
            h(View, { style: styles.roleCard, key: role.botSlug },
              h(View, { style: styles.roleTop }, h(Text, { style: styles.number }, String(index * 2 + 2).padStart(2, "0")), h(Text, { style: styles.roleName }, botNames.get(role.botSlug) ?? role.botSlug)),
              h(Text, { style: styles.roleBody }, role.responsibility),
              h(Link, { style: styles.roleLink, src: `https://botcabinet.com/bots/${role.botSlug}/` }, "OPEN BOT PROFILE"),
            ),
          )),
        ),
      ),
    ),

    h(Page, { size: "LETTER", style: styles.page },
      h(PageFrame, { kit },
        h(Text, { style: styles.pageKicker }, "02 / RUN THE WORK"),
        h(Text, { style: styles.pageTitle }, "Repeatable jobs and handoffs"),
        h(Text, { style: styles.pageDeck }, "Begin with one manual run. Preserve each approved output before the next Bot starts. Add schedules only after the handoffs work."),
        h(Ornament),
        h(View, { style: styles.twoCol },
          h(View, { style: styles.col },
            h(Text, { style: styles.sectionTitle }, "Core workflows"),
            ...kit.workflows.map((workflow) => h(View, { style: styles.workflowCard, key: workflow.name },
              h(Text, { style: styles.workflowTitle }, workflow.name),
              h(Text, { style: styles.workflowBody }, workflow.description),
              workflow.useCaseSlug ? h(Link, { style: styles.workflowLink, src: `https://botcabinet.com/use-cases/${workflow.useCaseSlug}/` }, "OPEN STEP-BY-STEP WORKFLOW") : null,
            )),
          ),
          h(View, { style: styles.col },
            h(Text, { style: styles.sectionTitle }, "Operating rhythm"),
            h(View, { style: styles.timeline }, ...kit.operatingRhythm.map((item) => h(View, { style: styles.timelineItem, key: item.timing },
              h(View, { style: styles.timelineDot }),
              h(Text, { style: styles.timelineTiming }, item.timing.toUpperCase()),
              h(Text, { style: styles.timelineAction }, item.action),
              h(Text, { style: styles.timelineOwner }, `Owner: ${item.owner}`),
            ))),
          ),
        ),
      ),
    ),

    h(Page, { size: "LETTER", style: styles.page },
      h(PageFrame, { kit },
        h(Text, { style: styles.pageKicker }, "03 / CREW PASSPORT"),
        h(Text, { style: styles.pageTitle }, "Access, approval and limits"),
        h(Text, { style: styles.pageDeck }, "The Passport is a planning record. Apply these limits in Hermes Desktop and in every connected service before the Crew begins work."),
        h(Ornament),
        h(View, { style: styles.passportBand },
          h(View, { style: [styles.passportCard, styles.allowed] }, h(Text, { style: [styles.passportLabel, { color: C.green }] }, "ALLOWED ACCESS"), h(Text, { style: styles.passportTitle }, "The Crew may use"), ...Bullets({ items: kit.passport.allowedAccess })),
          h(View, { style: [styles.passportCard, styles.approval] }, h(Text, { style: [styles.passportLabel, { color: C.amber }] }, "HUMAN ACTION"), h(Text, { style: styles.passportTitle }, "A person performs or releases"), ...Bullets({ items: kit.passport.approvalActions })),
          h(View, { style: [styles.passportCard, styles.prohibited] }, h(Text, { style: [styles.passportLabel, { color: C.red }] }, "PROHIBITED"), h(Text, { style: styles.passportTitle }, "Bots must never"), ...Bullets({ items: kit.passport.prohibitedActions })),
        ),
        h(View, { style: styles.noteBox },
          h(Text, { style: styles.noteTitle }, "APPLY THE RULES"),
          ...kit.passport.enforcementNotes.map((item) => h(Text, { style: styles.noteText, key: item }, `• ${item}`)),
        ),
      ),
    ),

    h(Page, { size: "LETTER", style: styles.page },
      h(PageFrame, { kit },
        h(Text, { style: styles.pageKicker }, "04 / FIRST DEPLOYMENT"),
        h(Text, { style: styles.pageTitle }, "Prepare, test and measure"),
        h(Text, { style: styles.pageDeck }, "Use low-risk sample material first. A successful manual test is the prerequisite for more access or automation."),
        h(Ornament),
        h(View, { style: styles.twoCol },
          h(View, { style: styles.col },
            h(View, { style: styles.sectionCard }, h(Text, { style: styles.sectionTitle }, "Shared inputs"), ...Bullets({ items: kit.sharedInputs })),
            h(View, { style: styles.sectionCard }, h(Text, { style: styles.sectionTitle }, "Success measures"), ...kit.successMeasures.map((item) => h(View, { style: styles.checkItem, key: item }, h(View, { style: styles.checkbox }), h(Text, { style: styles.checkText }, item)))),
          ),
          h(View, { style: styles.col },
            h(View, { style: styles.sectionCard }, h(Text, { style: styles.sectionTitle }, "Set up the kit"), ...kit.setupSteps.map((step, index) => h(View, { style: styles.step, key: step }, h(Text, { style: styles.stepNum }, String(index + 1).padStart(2, "0")), h(Text, { style: styles.stepText }, step)))),
          ),
        ),
        h(View, { style: styles.closing },
          h(Text, { style: styles.closingTitle }, "Return to the live Crew Kit"),
          h(Text, { style: styles.closingText }, "Open the current Bot profiles, linked workflows and any future updates from the live Bot Cabinet page."),
          h(Link, { style: styles.closingLink, src: kitUrl }, kitUrl.toUpperCase()),
        ),
      ),
    ),
  );
}

await mkdir(outputRoot, { recursive: true });
for (const kit of kits) {
  await renderToFile(h(CrewKitPdf, { kit }), path.join(outputRoot, `${kit.slug}.pdf`));
}

process.stdout.write(`${kits.length} polished crew-kit PDFs built in ${outputRoot}\n`);
