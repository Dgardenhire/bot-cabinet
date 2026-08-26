/* eslint-disable jsx-a11y/alt-text -- React PDF's Image component has no HTML alt prop. */
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  blueprintFirstMessage,
  blueprintSuccessChecks,
  type BotBlueprint,
} from "../lib/workshop";

const COLORS = {
  blueprint: "#102D37",
  blueprintDeep: "#071C23",
  cyan: "#A8D9E7",
  cyanDark: "#487B88",
  brass: "#C69A4B",
  brassDark: "#8D682B",
  vellum: "#F5F1E8",
  vellumDark: "#E7DFD0",
  ink: "#1D1C19",
  muted: "#625F58",
  green: "#527D59",
  red: "#8A4B3D",
  white: "#FFFFFF",
};

Font.registerHyphenationCallback((word) => {
  if (word.length <= 28) return [word];
  return word.match(/.{1,16}/g) ?? [word];
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 58,
    paddingRight: 44,
    paddingBottom: 54,
    paddingLeft: 44,
    backgroundColor: COLORS.vellum,
    color: COLORS.ink,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    lineHeight: 1.48,
  },
  cover: {
    position: "relative",
    backgroundColor: COLORS.blueprintDeep,
    color: COLORS.white,
    fontFamily: "Helvetica",
  },
  coverImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverShade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 365,
    backgroundColor: "rgba(5, 25, 32, 0.88)",
  },
  coverContent: {
    position: "absolute",
    top: 50,
    right: 258,
    bottom: 62,
    left: 48,
  },
  coverBrand: {
    width: 224,
  },
  coverWordmark: {
    width: 224,
    height: 47.4,
    objectFit: "contain",
  },
  coverProjectLine: {
    marginTop: 6,
    color: "#D9E7EA",
    fontFamily: "Courier-Bold",
    fontSize: 7.6,
    letterSpacing: 1.3,
  },
  coverKicker: {
    marginTop: 25,
    color: COLORS.cyan,
    fontFamily: "Courier",
    fontSize: 9,
    letterSpacing: 2.1,
  },
  coverRule: {
    width: 80,
    height: 2,
    marginTop: 17,
    marginBottom: 35,
    backgroundColor: COLORS.brass,
  },
  coverTitle: {
    color: COLORS.white,
    fontFamily: "Times-Roman",
    fontSize: 37,
    lineHeight: 1.02,
  },
  coverBotName: {
    marginTop: 16,
    color: COLORS.cyan,
    fontFamily: "Times-Roman",
    fontSize: 27,
    lineHeight: 1.08,
  },
  coverDescription: {
    marginTop: 16,
    color: "#D9E7EA",
    fontSize: 11,
    lineHeight: 1.55,
  },
  coverStatus: {
    width: 178,
    marginTop: 31,
    paddingTop: 10,
    paddingRight: 12,
    paddingBottom: 10,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: "rgba(168, 217, 231, 0.52)",
    backgroundColor: "rgba(8, 42, 52, 0.72)",
  },
  coverStatusLabel: {
    color: COLORS.brass,
    fontFamily: "Courier-Bold",
    fontSize: 8,
    letterSpacing: 1.1,
  },
  coverStatusValue: {
    marginTop: 4,
    color: COLORS.white,
    fontSize: 10,
  },
  coverFooter: {
    position: "absolute",
    right: 258,
    bottom: 62,
    left: 48,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: "rgba(168, 217, 231, 0.42)",
    color: "#AFC9CE",
    fontFamily: "Courier",
    fontSize: 7.8,
    lineHeight: 1.5,
  },
  header: {
    position: "absolute",
    top: 22,
    right: 44,
    left: 44,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vellumDark,
    color: COLORS.cyanDark,
    fontFamily: "Courier-Bold",
    fontSize: 7.5,
    letterSpacing: 0.8,
  },
  footer: {
    position: "absolute",
    top: 752,
    right: 44,
    left: 44,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.vellumDark,
    color: COLORS.muted,
    fontFamily: "Courier",
    fontSize: 7.2,
  },
  pageKicker: {
    marginBottom: 8,
    color: COLORS.brassDark,
    fontFamily: "Courier-Bold",
    fontSize: 8,
    letterSpacing: 1.4,
  },
  pageTitle: {
    marginBottom: 8,
    color: COLORS.blueprint,
    fontFamily: "Times-Roman",
    fontSize: 26,
    lineHeight: 1.05,
  },
  pageDeck: {
    maxWidth: 460,
    marginBottom: 20,
    color: COLORS.muted,
    fontSize: 10.5,
    lineHeight: 1.55,
  },
  statusBand: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cyanDark,
    backgroundColor: "#E8F1F1",
  },
  statusBandLabel: {
    width: 92,
    padding: 11,
    backgroundColor: COLORS.blueprint,
    color: COLORS.cyan,
    fontFamily: "Courier-Bold",
    fontSize: 8,
    letterSpacing: 1,
  },
  statusBandBody: {
    flex: 1,
    padding: 10,
    color: COLORS.blueprint,
    fontSize: 9.5,
  },
  twoColumn: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
  },
  section: {
    marginBottom: 11,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.vellumDark,
    backgroundColor: "#FBF8F1",
  },
  sectionAccent: {
    borderColor: COLORS.cyanDark,
    backgroundColor: "#EDF4F3",
  },
  sectionWarning: {
    borderColor: "#BE9A58",
    backgroundColor: "#F7EEDA",
  },
  sectionCode: {
    marginBottom: 5,
    color: COLORS.brassDark,
    fontFamily: "Courier-Bold",
    fontSize: 7.5,
    letterSpacing: 1,
  },
  sectionTitle: {
    marginBottom: 7,
    color: COLORS.blueprint,
    fontFamily: "Times-Roman",
    fontSize: 16,
    lineHeight: 1.15,
  },
  body: {
    color: COLORS.ink,
    fontSize: 10.2,
    lineHeight: 1.52,
  },
  muted: {
    color: COLORS.muted,
  },
  list: {
    marginTop: 2,
  },
  listRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: 4,
  },
  listDot: {
    width: 4,
    height: 4,
    marginTop: 5,
    marginRight: 8,
    borderRadius: 2,
    backgroundColor: COLORS.brass,
  },
  listText: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 9.8,
    lineHeight: 1.5,
  },
  checklistBox: {
    width: 9,
    height: 9,
    marginTop: 2.5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cyanDark,
    backgroundColor: COLORS.white,
  },
  flow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 20,
  },
  flowStep: {
    flex: 1,
    minHeight: 62,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.cyanDark,
    backgroundColor: "#E8F1F1",
  },
  flowConnector: {
    width: 12,
    height: 1,
    marginTop: 31,
    backgroundColor: COLORS.brass,
  },
  flowNumber: {
    marginBottom: 5,
    color: COLORS.brassDark,
    fontFamily: "Courier-Bold",
    fontSize: 7.4,
  },
  flowText: {
    color: COLORS.blueprint,
    fontSize: 8.2,
    lineHeight: 1.35,
  },
  profileTable: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.vellumDark,
  },
  profileRow: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vellumDark,
  },
  profileLabel: {
    width: 90,
    color: COLORS.brassDark,
    fontFamily: "Courier-Bold",
    fontSize: 7.8,
    letterSpacing: 0.6,
  },
  profileValue: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 9.7,
    lineHeight: 1.45,
  },
  numberedRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  numberedBadge: {
    width: 22,
    height: 22,
    marginRight: 10,
    paddingTop: 5,
    borderRadius: 11,
    backgroundColor: COLORS.blueprint,
    color: COLORS.cyan,
    fontFamily: "Courier-Bold",
    fontSize: 8,
    textAlign: "center",
  },
  numberedBody: {
    flex: 1,
    paddingTop: 2,
    color: COLORS.ink,
    fontSize: 9.8,
    lineHeight: 1.5,
  },
  codeBlock: {
    marginTop: 7,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cyanDark,
    backgroundColor: COLORS.blueprintDeep,
    color: "#D8E9EC",
    fontFamily: "Courier",
    fontSize: 9,
    lineHeight: 1.5,
  },
  noteLine: {
    height: 18,
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#BEB7AA",
  },
  link: {
    color: COLORS.cyanDark,
    textDecoration: "none",
  },
  small: {
    color: COLORS.muted,
    fontSize: 8.3,
    lineHeight: 1.45,
  },
});

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PageFrame({
  blueprint,
  code,
  children,
}: {
  blueprint: BotBlueprint;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <Page size="LETTER" style={styles.page} wrap bookmark={code}>
      <View style={styles.header} fixed>
        <Text>BOT BLUEPRINT / {code}</Text>
        <Text>{blueprint.profile.name.toLocaleUpperCase()}</Text>
      </View>
      <View style={styles.footer} fixed>
        <Text
          render={({ pageNumber, totalPages }) =>
            `BOT CABINET / BOT LAB    BB-${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`
          }
        />
      </View>
      {children}
    </Page>
  );
}

function PageHeading({
  code,
  title,
  deck,
}: {
  code: string;
  title: string;
  deck: string;
}) {
  return (
    <View minPresenceAhead={84}>
      <Text style={styles.pageKicker}>{code}</Text>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.pageDeck}>{deck}</Text>
    </View>
  );
}

function Section({
  code,
  title,
  children,
  accent = false,
  warning = false,
}: {
  code: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <View
      style={[
        styles.section,
        accent ? styles.sectionAccent : {},
        warning ? styles.sectionWarning : {},
      ]}
    >
      <Text style={styles.sectionCode}>{code}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function PlainText({ value, empty }: { value: string; empty: string }) {
  return <Text style={[styles.body, !value ? styles.muted : {}]}>{value || empty}</Text>;
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  const values = items.length ? items : [empty];

  return (
    <View style={styles.list}>
      {values.map((item, index) => (
        <View style={styles.listRow} key={`${index}-${item}`}>
          <View style={styles.listDot} />
          <Text style={[styles.listText, !items.length ? styles.muted : {}]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View style={styles.listRow} key={`${index}-${item}`} wrap={false}>
          <View style={styles.checklistBox} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function ChecklistColumns({ items }: { items: string[] }) {
  const splitAt = Math.ceil(items.length / 2);

  return (
    <View style={styles.twoColumn}>
      <View style={styles.column}>
        <Checklist items={items.slice(0, splitAt)} />
      </View>
      <View style={styles.column}>
        <Checklist items={items.slice(splitAt)} />
      </View>
    </View>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, index) => (
        <View style={styles.numberedRow} key={`${index}-${item}`} wrap={false}>
          <Text style={styles.numberedBadge}>{String(index + 1).padStart(2, "0")}</Text>
          <Text style={styles.numberedBody}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label.toLocaleUpperCase()}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

function Flow() {
  const steps = [
    "Approved information",
    "Bot completes the job",
    "Draft result",
    "Human decision",
    "Use or revise",
  ];

  return (
    <View style={styles.flow} wrap={false}>
      {steps.map((step, index) => (
        <View key={step} style={{ display: "flex", flexDirection: "row", flex: 1 }}>
          <View style={styles.flowStep}>
            <Text style={styles.flowNumber}>{String(index + 1).padStart(2, "0")}</Text>
            <Text style={styles.flowText}>{step}</Text>
          </View>
          {index < steps.length - 1 && <View style={styles.flowConnector} />}
        </View>
      ))}
    </View>
  );
}

export type WorkshopBlueprintPdfProps = {
  blueprint: BotBlueprint;
  generatedAt: string;
  coverImageSrc?: string;
  wordmarkImageSrc?: string;
};

export function WorkshopBlueprintPdf({
  blueprint,
  generatedAt,
  coverImageSrc,
  wordmarkImageSrc,
}: WorkshopBlueprintPdfProps) {
  const successChecks = blueprintSuccessChecks(blueprint);
  const firstMessage = blueprintFirstMessage(blueprint);
  const completion = `${blueprint.completedFields} of ${blueprint.totalFields} core fields filled`;

  return (
    <Document
      title={`${blueprint.profile.name} - Bot Blueprint`}
      author="Bot Cabinet, a LINCHPIN project"
      subject="A practical setup plan for a Hermes Bot"
      keywords="Hermes Bot, Bot Blueprint, Bot Cabinet, Bot Lab"
      creator="Bot Cabinet / Bot Lab"
      producer="Bot Cabinet / Bot Lab"
      language="en-US"
    >
      <Page size="LETTER" style={styles.cover} bookmark="Bot Blueprint">
        {coverImageSrc && <Image src={coverImageSrc} style={styles.coverImage} />}
        <View style={styles.coverShade} />
        <View style={styles.coverContent}>
          {wordmarkImageSrc && (
            <View style={styles.coverBrand}>
              <Image src={wordmarkImageSrc} style={styles.coverWordmark} />
              <Text style={styles.coverProjectLine}>A LINCHPIN PROJECT</Text>
            </View>
          )}
          <Text style={styles.coverKicker}>BOT CABINET / BOT LAB / BB-01</Text>
          <View style={styles.coverRule} />
          <Text style={styles.coverTitle}>Bot Blueprint</Text>
          <Text style={styles.coverBotName}>{blueprint.profile.name}</Text>
          <Text style={styles.coverDescription}>{blueprint.profile.title}</Text>
          <View style={styles.coverStatus}>
            <Text style={styles.coverStatusLabel}>DOCUMENT STATUS</Text>
            <Text style={styles.coverStatusValue}>Draft / {completion}</Text>
          </View>
        </View>
        <View style={styles.coverFooter}>
          <Text>A practical setup and first-test plan for Hermes Desktop</Text>
          <Text>Created {formatDate(generatedAt)} / Blueprint version 1</Text>
        </View>
      </Page>

      <PageFrame blueprint={blueprint} code="AT A GLANCE">
        <PageHeading
          code="01 / PLAN SUMMARY"
          title="The whole Bot plan in one minute"
          deck="Use this page to confirm the job, the first test, and the decisions that remain with a person."
        />
        <View style={styles.statusBand} wrap={false}>
          <Text style={styles.statusBandLabel}>DRAFT PLAN</Text>
          <Text style={styles.statusBandBody}>
            {completion}. Use this plan to create, test, and schedule the Bot in Hermes Desktop.
          </Text>
        </View>
        <Flow />
        <Section code="01A" title="Job and outcome" accent>
          <PlainText value={blueprint.mission} empty="Complete the job and outcome field." />
        </Section>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Section code="01B" title="When work begins">
              <PlainText value={blueprint.cadence} empty="Complete the timing field." />
            </Section>
          </View>
          <View style={styles.column}>
            <Section code="01C" title="First test">
              <PlainText value={blueprint.firstRunTest} empty="Complete the first-test field." />
            </Section>
          </View>
        </View>
        <Section code="01D" title="Human decision points" warning>
          <BulletList items={blueprint.approvals} empty="Complete the approval field before testing." />
        </Section>
      </PageFrame>

      <PageFrame blueprint={blueprint} code="WORK BRIEF">
        <PageHeading
          code="02 / WORK BRIEF"
          title="What useful work means"
          deck="These are the materials the Bot may use, the result it should return, and the checks a person can apply."
        />
        <Section code="02A" title="Job and intended outcome">
          <PlainText value={blueprint.mission} empty="Complete the job and outcome field." />
        </Section>
        <Section code="02B" title="Who this helps and the quality standard" accent>
          <PlainText
            value={blueprint.audienceSuccess}
            empty="Add the intended user and quality standard in Refine your Blueprint."
          />
        </Section>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Section code="02C" title="Information and rules">
              <BulletList items={blueprint.inputs} empty="Complete the information and rules field." />
            </Section>
          </View>
          <View style={styles.column}>
            <Section code="02D" title="Expected deliverables">
              <BulletList items={blueprint.outputs} empty="Complete the deliverables field." />
            </Section>
          </View>
        </View>
        <Section code="02E" title="Review checks" warning>
          <ChecklistColumns items={successChecks} />
        </Section>
      </PageFrame>

      <PageFrame blueprint={blueprint} code="OPERATING PLAN">
        <PageHeading
          code="03 / OPERATING PLAN"
          title="Access, timing, and human control"
          deck="Review these choices before enabling a skill, tool, account, routine, or other connection."
        />
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Section code="03A" title="When it should run">
              <PlainText value={blueprint.cadence} empty="Complete the timing field." />
            </Section>
          </View>
          <View style={styles.column}>
            <Section code="03B" title="Requested capabilities">
              <BulletList items={blueprint.tools} empty="Complete the tools and services field." />
            </Section>
          </View>
        </View>
        <Section code="03C" title="When it must ask you" warning>
          <BulletList items={blueprint.approvals} empty="Complete the approval field before testing." />
        </Section>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Section code="03D" title="Access and sensitive information">
              <PlainText
                value={blueprint.accessSensitive}
                empty="Add exact access and sensitive-information limits in Refine your Blueprint."
              />
            </Section>
          </View>
          <View style={styles.column}>
            <Section code="03E" title="Prohibited actions and uncertainty" warning>
              <PlainText
                value={blueprint.prohibitedUncertainty}
                empty="Add prohibited actions and instructions for uncertainty in Refine your Blueprint."
              />
            </Section>
          </View>
        </View>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Section code="03F" title="Conversation, memory, routines, and collaboration" accent>
              <PlainText
                value={blueprint.continuityMemory}
                empty="Decide what should carry forward in this Bot's conversation, what it may remember, and whether it needs a routine or other Bots."
              />
            </Section>
          </View>
          <View style={styles.column}>
            <Section code="03G" title="When information is missing" accent>
              <Text style={styles.body}>
                Stop and tell a person what is missing or uncertain. Ask what to do, use verified information, and wait for direction before continuing.
              </Text>
            </Section>
          </View>
        </View>
      </PageFrame>

      <PageFrame blueprint={blueprint} code="FIRST TEST">
        <PageHeading
          code="04 / FIRST-RUN TEST"
          title="Start small and inspect the result"
          deck="The first run should use limited material and access. Review the result before giving the Bot a recurring routine or broader permissions."
        />
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Section code="04A" title="Test task" accent>
              <PlainText value={blueprint.firstRunTest} empty="Complete the first-test field." />
            </Section>
          </View>
          <View style={styles.column}>
            <Section code="04B" title="Reviewer and pass standard">
              <PlainText
                value={blueprint.reviewCriteria}
                empty="Add a reviewer and pass standard in Refine your Blueprint."
              />
            </Section>
          </View>
        </View>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Section code="04C" title="Before the test">
              <Checklist
                items={[
                  "Use sample or low-risk material.",
                  "Enable only the capabilities needed for this test.",
                  "Confirm the approval points with the reviewer.",
                  "Know where the Bot will save or return the result.",
                ]}
              />
            </Section>
          </View>
          <View style={styles.column}>
            <Section code="04D" title="After the test">
              <Checklist items={successChecks} />
            </Section>
          </View>
        </View>
      </PageFrame>

      <PageFrame blueprint={blueprint} code="FIRST MESSAGE">
        <PageHeading
          code="04B / RUN AND REVIEW"
          title="Send the test and choose the next step"
          deck="Paste this message into the Bot's continuing conversation. Keep the result in review until a person chooses what happens next."
        />
        <Section code="04E" title="First message to send">
          <Text style={styles.codeBlock}>{firstMessage}</Text>
        </Section>
        <Section code="04F" title="Decision after review" warning>
          <Checklist
            items={[
              "Revise the Bot plan.",
              "Run another limited test.",
              "Keep the current access and begin regular use.",
              "Add one specific capability after reviewing the added risk.",
            ]}
          />
        </Section>
      </PageFrame>

      <PageFrame blueprint={blueprint} code="HERMES SETUP">
        <PageHeading
          code="05 / HERMES DESKTOP"
          title="Create and test the Bot"
          deck="Bot Lab prepares this plan. You choose and apply each setting in Hermes Desktop and can change it later."
        />
        <Section code="05A" title="Profile fields" accent>
          <View style={styles.profileTable}>
            <ProfileRow label="Name" value={blueprint.profile.name} />
            <ProfileRow label="Title" value={blueprint.profile.title} />
            <ProfileRow label="Description" value={blueprint.profile.description} />
          </View>
        </Section>
        <Section code="05B" title="Setup steps">
          <NumberedList
            items={[
              "Open the Bots tab and choose New Agent.",
              "Choose Fresh profile or clone an existing profile after reviewing what the clone contains.",
              "Enter the Name, Title, and Description shown above.",
              "Open Advanced and paste the permanent role instructions from this Blueprint into Custom SOUL.md.",
              "Choose a model or use the launch profile's model.",
              "Enable only the skills, toolsets, and outside-service connections this job requires.",
              "Create the Bot and send the first-test message from this Blueprint.",
              "Review the result before adding a recurring routine, more access, or a group-chat role.",
            ]}
          />
        </Section>
        <Text style={styles.small}>
          Official reference: {" "}
          <Link
            style={styles.link}
            src="https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode"
          >
            Hermes Bot Mode guide
          </Link>
          {"  /  "}
          <Link
            style={styles.link}
            src="https://hermes-agent.nousresearch.com/docs/user-guide/features/cron"
          >
            Hermes scheduled tasks guide
          </Link>
        </Text>
      </PageFrame>

      <PageFrame blueprint={blueprint} code="ROLE INSTRUCTIONS">
        <PageHeading
          code="06 / READY-TO-COPY MATERIAL"
          title="Permanent role instructions"
          deck="Review this text, then paste it into the Custom SOUL.md field in Hermes Desktop. Keep one-time test details in the first message instead."
        />
        <Section code="06A" title="Custom SOUL.md">
          <Text style={styles.codeBlock} orphans={3} widows={3}>
            {blueprint.soulText}
          </Text>
        </Section>
      </PageFrame>

      <PageFrame blueprint={blueprint} code="REVIEW RECORD">
        <PageHeading
          code="07 / REVIEW RECORD"
          title="Record what happened"
          deck="Use this page after the first run. A short record makes the next revision easier and shows why access changed."
        />
        <Section code="07A" title="First-run notes" accent>
          <Text style={styles.body}>Test date</Text>
          <View style={styles.noteLine} />
          <Text style={[styles.body, { marginTop: 12 }]}>Reviewed by</Text>
          <View style={styles.noteLine} />
          <Text style={[styles.body, { marginTop: 12 }]}>What worked</Text>
          <View style={styles.noteLine} />
          <View style={styles.noteLine} />
          <Text style={[styles.body, { marginTop: 12 }]}>What needs revision</Text>
          <View style={styles.noteLine} />
          <View style={styles.noteLine} />
          <Text style={[styles.body, { marginTop: 12 }]}>Access added or removed</Text>
          <View style={styles.noteLine} />
          <View style={styles.noteLine} />
          <Text style={[styles.body, { marginTop: 12 }]}>Next test</Text>
          <View style={styles.noteLine} />
          <View style={styles.noteLine} />
        </Section>
        <View style={styles.statusBand} wrap={false}>
          <Text style={styles.statusBandLabel}>KEEP THIS FILE</Text>
          <Text style={styles.statusBandBody}>
            {"Save the PDF and Markdown file together. Update the Markdown when the Bot's job, access, approval rules, or routine changes."}
          </Text>
        </View>
        <Text style={styles.small}>
          Bot Lab created this Blueprint in your browser. Follow the setup pages to create, test, and schedule the Bot in Hermes Desktop.
        </Text>
      </PageFrame>
    </Document>
  );
}
