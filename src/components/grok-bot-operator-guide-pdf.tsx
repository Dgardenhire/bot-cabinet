import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import {
  GROK_OPERATOR_SECTIONS,
  GROK_OPERATOR_SHORTCUTS,
  GROK_OPERATOR_SOURCES,
  GROK_OPERATOR_UPDATED,
} from "../data/grok-bot-operator-guide";

export const GROK_OPERATOR_PDF_OUTPUT_PATH =
  "public/downloads/guides/grok-bot-operator-guide.pdf";

const colors = {
  ink: "#0B100F",
  inkSoft: "#151C1A",
  cream: "#F2EBDD",
  brass: "#C7983B",
  brassLight: "#E0B75C",
  blue: "#A8D9E7",
  muted: "#AFAFA8",
  line: "#3D423D",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingRight: 42,
    paddingBottom: 38,
    paddingLeft: 42,
    backgroundColor: colors.ink,
    color: colors.cream,
    fontFamily: "Helvetica",
    fontSize: 9.2,
    lineHeight: 1.4,
  },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { fontFamily: "Times-Bold", fontSize: 17, letterSpacing: 1.2 },
  date: { color: colors.muted, fontFamily: "Courier", fontSize: 7.2, letterSpacing: 0.7 },
  title: { marginTop: 31, fontFamily: "Times-Roman", fontSize: 34, lineHeight: 1.02 },
  deck: { width: 430, marginTop: 12, color: colors.blue, fontSize: 11.5, lineHeight: 1.45 },
  rule: { width: 68, height: 3, marginTop: 17, marginBottom: 24, backgroundColor: colors.brass },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  card: { width: "48.5%", padding: 14, backgroundColor: colors.inkSoft, borderTopWidth: 1, borderTopColor: colors.brass },
  cardHeading: { flexDirection: "row", gap: 8, marginBottom: 8, alignItems: "baseline" },
  number: { color: colors.brassLight, fontFamily: "Courier-Bold", fontSize: 8.5 },
  heading: { flex: 1, fontFamily: "Helvetica-Bold", fontSize: 11.5 },
  bullet: { flexDirection: "row", marginBottom: 4 },
  bulletMark: { width: 10, color: colors.brassLight },
  bulletText: { flex: 1, color: colors.cream },
  handoff: { marginTop: 18, padding: 11, borderWidth: 1, borderColor: colors.blue, textAlign: "center", fontFamily: "Helvetica-Bold", fontSize: 10.2 },
  footer: { position: "absolute", right: 42, bottom: 18, left: 42, flexDirection: "row", justifyContent: "space-between", color: colors.muted, fontFamily: "Courier", fontSize: 6.8 },
  pageTwoTitle: { marginTop: 26, fontFamily: "Times-Roman", fontSize: 27 },
  split: { flexDirection: "row", gap: 22, marginTop: 18 },
  column: { flex: 1 },
  subheading: { marginBottom: 10, color: colors.brassLight, fontFamily: "Courier-Bold", fontSize: 8, letterSpacing: 1.2 },
  shortcut: { flexDirection: "row", paddingTop: 6, paddingBottom: 6, borderBottomWidth: 0.5, borderBottomColor: colors.line },
  shortcutKey: { width: 94, color: colors.blue, fontFamily: "Courier-Bold", fontSize: 8 },
  shortcutText: { flex: 1 },
  source: { marginBottom: 8 },
  sourceLink: { color: colors.blue, fontSize: 8.2 },
  note: { marginTop: 18, padding: 13, backgroundColor: colors.inkSoft, color: colors.muted, fontSize: 8.4, lineHeight: 1.45 },
});

function Footer({ page }: { page: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>BOTCABINET.COM / GROK BOT OPERATOR GUIDE</Text>
      <Text>{page}</Text>
    </View>
  );
}
export function GrokBotOperatorGuidePdf() {
  return (
    <Document
      title="Grok Bot operator guide"
      author="Bot Cabinet"
      subject="A concise, sourced guide to operating Grok Bot"
      keywords="Bot Cabinet, Grok Bot, skills, routines, approvals, group chats"
      creator="Bot Cabinet"
      producer="Bot Cabinet"
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>BOT CABINET</Text>
          <Text style={styles.date}>CHECKED {GROK_OPERATOR_UPDATED.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>Grok Bot operator guide</Text>
        <Text style={styles.deck}>Find the job, keep the boundary clear, test the work and automate only after the result is dependable.</Text>
        <View style={styles.rule} />
        <View style={styles.grid}>
          {GROK_OPERATOR_SECTIONS.map((section) => (
            <View style={styles.card} key={section.number} wrap={false}>
              <View style={styles.cardHeading}>
                <Text style={styles.number}>{section.number}</Text>
                <Text style={styles.heading}>{section.title}</Text>
              </View>
              {section.bullets.map((bullet) => (
                <View style={styles.bullet} key={bullet}>
                  <Text style={styles.bulletMark}>+</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.handoff}>THE FIVE-LINE HANDOFF: OUTCOME / SOURCES / CONSTRAINTS / DELIVERABLE / REVIEW POINT</Text>
        <Footer page="01 / 02" />
      </Page>

      <Page size="LETTER" style={styles.page}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>BOT CABINET</Text>
          <Text style={styles.date}>QUICK REFERENCE</Text>
        </View>
        <Text style={styles.pageTwoTitle}>Commands, checks and primary sources</Text>
        <View style={styles.split}>
          <View style={styles.column}>
            <Text style={styles.subheading}>DESKTOP SHORTCUTS</Text>
            {GROK_OPERATOR_SHORTCUTS.map(([key, meaning]) => (
              <View style={styles.shortcut} key={key}>
                <Text style={styles.shortcutKey}>{key}</Text>
                <Text style={styles.shortcutText}>{meaning}</Text>
              </View>
            ))}
          </View>
          <View style={styles.column}>
            <Text style={styles.subheading}>OFFICIAL DOCUMENTATION</Text>
            {GROK_OPERATOR_SOURCES.map((source) => (
              <View style={styles.source} key={source.href}>
                <Text>{source.label}</Text>
                <Link style={styles.sourceLink} src={source.href}>{source.href}</Link>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.note}>
          Bot Cabinet is an independent guide and is not affiliated with xAI or Cursor. Product behavior, limits and controls can change. This guide was checked against the official Grok Bot documentation on {GROK_OPERATOR_UPDATED}. Review the current documentation before connecting sensitive accounts or allowing consequential actions.
        </Text>
        <Footer page="02 / 02" />
      </Page>
    </Document>
  );
}
