import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { getGuide, type GuideSection } from "../data/guides";

const reliableBotsGuide = getGuide("run-bots-reliably");

if (!reliableBotsGuide) {
  throw new Error("The reliable Bots guide is missing from the guide catalog.");
}

const guide = reliableBotsGuide;

export const RELIABLE_BOTS_PDF_OUTPUT_PATH =
  "output/pdf/how-to-run-bots-reliably.pdf";

export const RELIABLE_BOTS_PDF_PAGE_CODES = [
  "THE JOB",
  "THE SHAPE",
  "THE GUARDRAILS",
  "THE TEST",
  "THE LOOP",
] as const;

const FIELD_NOTES_URL = "https://github.com/unicodef1wn/grokbot-field-notes";

const COLORS = {
  cream: "#F2EBDD",
  creamDeep: "#E2D5BE",
  charcoal: "#171814",
  charcoalSoft: "#282A24",
  brass: "#B78934",
  brassLight: "#D4AB5A",
  ink: "#22231F",
  muted: "#625F57",
  white: "#FFFDF7",
  paleBlue: "#D8E8EB",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 58,
    paddingRight: 48,
    paddingBottom: 54,
    paddingLeft: 48,
    backgroundColor: COLORS.cream,
    color: COLORS.ink,
    fontFamily: "Helvetica",
    fontSize: 10.2,
    lineHeight: 1.48,
  },
  cover: {
    paddingTop: 56,
    paddingRight: 52,
    paddingBottom: 54,
    paddingLeft: 52,
    backgroundColor: COLORS.charcoal,
    color: COLORS.white,
    fontFamily: "Helvetica",
  },
  coverBrand: {
    color: COLORS.cream,
    fontFamily: "Times-Bold",
    fontSize: 20,
    letterSpacing: 1.2,
  },
  coverKicker: {
    marginTop: 82,
    color: COLORS.brassLight,
    fontFamily: "Courier-Bold",
    fontSize: 8.5,
    letterSpacing: 2.2,
  },
  coverRule: {
    width: 76,
    height: 3,
    marginTop: 18,
    marginBottom: 30,
    backgroundColor: COLORS.brass,
  },
  coverTitle: {
    maxWidth: 430,
    color: COLORS.cream,
    fontFamily: "Times-Roman",
    fontSize: 42,
    lineHeight: 1.02,
  },
  coverDeck: {
    maxWidth: 420,
    marginTop: 24,
    color: COLORS.paleBlue,
    fontSize: 13,
    lineHeight: 1.5,
  },
  coverBand: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: 36,
    backgroundColor: COLORS.brass,
  },
  coverFooter: {
    position: "absolute",
    right: 52,
    bottom: 48,
    left: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    color: COLORS.cream,
    fontFamily: "Courier",
    fontSize: 7.6,
    letterSpacing: 1.1,
  },
  header: {
    position: "absolute",
    top: 24,
    right: 48,
    left: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 7,
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.brass,
    color: COLORS.muted,
    fontFamily: "Courier-Bold",
    fontSize: 7.2,
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    right: 48,
    bottom: 23,
    left: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    color: COLORS.muted,
    fontFamily: "Courier",
    fontSize: 7.2,
    letterSpacing: 0.7,
  },
  pageKicker: {
    color: COLORS.brass,
    fontFamily: "Courier-Bold",
    fontSize: 8.2,
    letterSpacing: 1.8,
  },
  pageTitle: {
    marginTop: 10,
    color: COLORS.charcoal,
    fontFamily: "Times-Roman",
    fontSize: 28,
    lineHeight: 1.08,
  },
  pageDeck: {
    marginTop: 10,
    marginBottom: 21,
    color: COLORS.muted,
    fontSize: 11.5,
    lineHeight: 1.45,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeading: {
    marginBottom: 7,
    color: COLORS.charcoal,
    fontFamily: "Helvetica-Bold",
    fontSize: 12.4,
  },
  paragraph: {
    marginBottom: 7,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bulletMark: {
    width: 14,
    color: COLORS.brass,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
  },
  contract: {
    marginTop: 3,
    marginBottom: 10,
    paddingTop: 12,
    paddingRight: 14,
    paddingBottom: 12,
    paddingLeft: 14,
    backgroundColor: COLORS.charcoalSoft,
    color: COLORS.cream,
    fontFamily: "Courier",
    fontSize: 8.5,
    lineHeight: 1.55,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brassLight,
  },
  note: {
    marginTop: 5,
    paddingTop: 9,
    paddingRight: 11,
    paddingBottom: 9,
    paddingLeft: 11,
    backgroundColor: COLORS.creamDeep,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.brass,
    color: COLORS.ink,
    fontSize: 9.2,
  },
  sourceBox: {
    marginTop: 12,
    paddingTop: 12,
    paddingRight: 14,
    paddingBottom: 12,
    paddingLeft: 14,
    backgroundColor: COLORS.charcoalSoft,
    color: COLORS.cream,
  },
  sourceLabel: {
    color: COLORS.brassLight,
    fontFamily: "Courier-Bold",
    fontSize: 7.6,
    letterSpacing: 1.2,
  },
  sourceText: {
    marginTop: 6,
    color: COLORS.cream,
    fontSize: 9.2,
    lineHeight: 1.45,
  },
  sourceLink: {
    marginTop: 7,
    color: COLORS.paleBlue,
    fontFamily: "Courier",
    fontSize: 8,
  },
});

function findSection(heading: string): GuideSection {
  const section = guide.sections.find((item) => item.heading === heading);
  if (!section) throw new Error(`Missing reliable Bots PDF section: ${heading}`);
  return section;
}

function SectionBlock({ heading }: { heading: string }) {
  const section = findSection(heading);
  return (
    <View style={styles.section} minPresenceAhead={74}>
      <Text style={styles.sectionHeading}>{section.heading}</Text>
      {section.paragraphs?.map((paragraph) => (
        <Text style={styles.paragraph} key={paragraph}>
          {paragraph}
        </Text>
      ))}
      {section.code ? <Text style={styles.contract}>{section.code}</Text> : null}
      {section.bullets?.map((bullet) => (
        <View style={styles.bulletRow} key={bullet}>
          <Text style={styles.bulletMark}>+</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
      {section.note ? <Text style={styles.note}>{section.note}</Text> : null}
    </View>
  );
}

function PageFrame({
  code,
  title,
  deck,
  children,
}: {
  code: (typeof RELIABLE_BOTS_PDF_PAGE_CODES)[number];
  title: string;
  deck: string;
  children: React.ReactNode;
}) {
  return (
    <Page size="LETTER" style={styles.page} wrap bookmark={title}>
      <View style={styles.header} fixed>
        <Text>BOT CABINET / FIELD MANUAL</Text>
        <Text>{code}</Text>
      </View>
      <View style={styles.footer} fixed>
        <Text>BOTCABINET.COM / GUIDES</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            `${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`
          }
        />
      </View>
      <Text style={styles.pageKicker}>{code}</Text>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.pageDeck}>{deck}</Text>
      {children}
    </Page>
  );
}

export function ReliableBotsGuidePdf() {
  return (
    <Document
      title="How to run Bots reliably"
      author="Bot Cabinet"
      subject="A plain-language field guide to reliable AI Bot work"
      keywords="Bot Cabinet, AI agents, Hermes, reliability, testing, approvals"
      creator="Bot Cabinet"
      producer="Bot Cabinet"
    >
      <Page size="LETTER" style={styles.cover} bookmark="Cover">
        <Text style={styles.coverBrand}>BOT CABINET</Text>
        <Text style={styles.coverKicker}>FIELD MANUAL / RELIABLE WORK</Text>
        <View style={styles.coverRule} />
        <Text style={styles.coverTitle}>How to run Bots reliably</Text>
        <Text style={styles.coverDeck}>{guide.summary}</Text>
        <View style={styles.coverBand} />
        <View style={styles.coverFooter}>
          <Text>BOTCABINET.COM</Text>
          <Text>UPDATED {guide.updated}</Text>
        </View>
      </Page>

      <PageFrame
        code="THE JOB"
        title="Make the job clear before the Bot begins"
        deck="A reliable Bot needs a finish line, a stop rule and a record a person can inspect."
      >
        <SectionBlock heading="Start with the job, not the Bot" />
        <SectionBlock heading="Write a short job contract" />
      </PageFrame>

      <PageFrame
        code="THE SHAPE"
        title="Choose the smallest useful shape"
        deck="A Bot, a saved skill and a schedule solve different problems."
      >
        <SectionBlock heading="Choose a Bot, a skill or a routine" />
        <SectionBlock heading="Keep changing facts in one trusted place" />
      </PageFrame>

      <PageFrame
        code="THE GUARDRAILS"
        title="Give freedom in proportion to possible harm"
        deck="The important question is what happens when the Bot is wrong."
      >
        <SectionBlock heading="Match freedom to possible harm" />
        <SectionBlock heading="Use the simplest structure that can do the job" />
      </PageFrame>

      <PageFrame
        code="THE TEST"
        title="Test the work and test the failure"
        deck="A green checkmark is not enough. Keep the full result and make the Bot face a safe problem."
      >
        <SectionBlock heading="Run one small test that looks like the real job" />
        <SectionBlock heading="Test failure before you trust success" />
      </PageFrame>

      <PageFrame
        code="THE LOOP"
        title="Correct the rule, control the cost"
        deck="Preserve the old version, rerun the same tests and slow down work that no longer pays for itself."
      >
        <SectionBlock heading="Turn corrections into clear rules" />
        <SectionBlock heading="Control cost before you add a schedule" />
        <View style={styles.sourceBox}>
          <Text style={styles.sourceLabel}>SOURCE AND LIMIT</Text>
          <Text style={styles.sourceText}>
            This guide draws on an independent synthesis by GitHub user
            unicodef1wn of a 72-hour public build by members of the Grok Bot
            team. It is not official xAI guidance. Bot Cabinet has not tested
            this complete method as one system.
          </Text>
          <Link src={FIELD_NOTES_URL} style={styles.sourceLink}>
            github.com/unicodef1wn/grokbot-field-notes
          </Link>
        </View>
      </PageFrame>
    </Document>
  );
}
