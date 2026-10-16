import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { CabinetInstall } from "@/components/cabinet-install";
import { Eyebrow } from "@/components/ui";
import {
  CABINET_MANUAL_URL,
  CABINET_MIN_HERMES,
  CABINET_REPO_URL,
  CABINET_VERSION,
} from "@/data/hermes-cabinet";
import { buildPageMetadata } from "@/lib/metadata";
import styles from "./manual.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Cabinet manual · Bot Cabinet in Hermes",
  description:
    "How to install and use Cabinet, a Hermes Desktop plugin that suggests the simplest setup for a job, then adds Bots and crews from botcabinet.com.",
  path: "/hermes/manual/",
  image: "/brand/social/cabinet-for-hermes-1200x630.jpg",
  imageAlt: "Cabinet, a plugin for Hermes Desktop that adds Bots and crews from botcabinet.com",
});

const SHOT_DIR = "/hermes-cabinet/manual";

type ShotProps = { name: string; width: number; height: number; alt: string; title: string; caption: string; narrow?: boolean; eager?: boolean };

function Shot({ name, width, height, alt, title, caption, narrow, eager }: ShotProps) {
  return (
    <figure className={`${styles.shot} ${narrow ? styles.narrow : ""}`}>
      <div className={styles.frame}>
        <Image src={`${SHOT_DIR}/${name}.jpg`} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} />
      </div>
      <figcaption>
        <b>{title}</b>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

function Ui({ children }: { children: React.ReactNode }) {
  return <span className={styles.ui}>{children}</span>;
}

const contents = [
  ["what", "What it's for"],
  ["install", "Getting it running"],
  ["start", "Your first look"],
  ["fit", "Bot or no Bot"],
  ["add", "Adding a Bot"],
  ["lab", "Build your own"],
  ["crews", "Bots that team up"],
  ["mybots", "Changing your mind"],
  ["records", "How the Bots tested"],
  ["beside", "Working with Hermes Bots"],
  ["faq", "Questions"],
  ["credits", "Credits"],
] as const;

const ladder = [
  ["Ask Hermes once", "A single chat message. A button opens a new chat with your job already typed in."],
  ["Save it as a skill", "Steps Hermes follows each time you ask, in the chat you already use."],
  ["Run it on a schedule", "Hermes runs the job for you at a set time."],
  ["One Bot", "A helper with its own chat, its own instructions and a memory of past work."],
  ["A crew", "Several Bots, each with its own job, passing work along in order."],
] as const;

export default function CabinetManualPage() {
  return (
    <main id="main-content" className="page-main">
      <header className={`shell ${styles.hero}`}>
        <Link href="/hermes" className={styles.back}>
          <ArrowLeft size={15} aria-hidden="true" /> Bot Cabinet in Hermes
        </Link>
        <Eyebrow>Hermes Desktop plugin · Manual</Eyebrow>
        <h1>Cabinet</h1>
        <p className={styles.sub}>
          Tell Cabinet a job you need done. It suggests the simplest setup that can do it, then helps you add a Bot,
          plan your own, or set up a crew.
        </p>
        <dl className={styles.facts}>
          <div><dt>Version</dt><dd>{CABINET_VERSION}</dd></div>
          <div><dt>Needs</dt><dd>Hermes {CABINET_MIN_HERMES} or later</dd></div>
          <div><dt>License</dt><dd>MIT</dd></div>
          <div><dt>Source</dt><dd><a href={CABINET_REPO_URL} target="_blank" rel="noreferrer">GitHub</a></dd></div>
          <div><dt>Bots from</dt><dd><Link href="/bots">botcabinet.com</Link></dd></div>
        </dl>
        <p className={styles.printOnly}>The screenshots are in the web version at {CABINET_MANUAL_URL.replace("https://", "")}.</p>
      </header>

      <div className={`shell ${styles.layout}`}>
        <nav className={styles.toc} aria-label="Contents">
          <p>Contents</p>
          <ol>
            {contents.map(([id, label]) => (
              <li key={id}><a href={`#${id}`}>{label}</a></li>
            ))}
          </ol>
        </nav>

        <div className={styles.body}>
          <section className={styles.sec} id="what" aria-labelledby="what-title">
            <h2 id="what-title">What it&apos;s for</h2>
            <div className={styles.prose}>
              <p className={styles.lead}>
                Cabinet helps you get the right helper for a job in Hermes. You describe the job, and it suggests the
                simplest setup that can do it.
              </p>
              <p>Sometimes that&apos;s one chat message. Sometimes it&apos;s a Bot, a helper with its own chat and instructions.</p>
              <p>
                For bigger jobs, it&apos;s a crew of Bots that work together. The Bots come from Bot Cabinet, a library of
                ready-made Bots at <Link href="/bots">botcabinet.com</Link>.
              </p>
              <p>
                You don&apos;t need to write code. Each Bot that Cabinet adds becomes a normal bot in Hermes. You can remove it
                later, as long as you haven&apos;t changed it.
              </p>
              <p>Cabinet is an independent plugin developed by Damon Gardenhire. It is not an official plugin for Hermes made by Nous Research.</p>
            </div>
            <Shot name="start" width={1168} height={1462} eager title="Start Here" caption="Start Here is the first page you see, with seven tabs across the top." alt="Cabinet's Start Here page: a cabinet-doors banner, the five Fit Test answers, six Bot portraits with test badges, a Crew Kit and a summary of test records" />
          </section>

          <section className={styles.sec} id="install" aria-labelledby="install-title">
            <h2 id="install-title">Getting it running</h2>
            <div className={styles.prose}>
              <p>You install Cabinet once, from inside Hermes Desktop. After that, it lives in the sidebar.</p>
              <p>You need Hermes {CABINET_MIN_HERMES} or later, and git, which Hermes uses to download plugins.</p>
            </div>
            <CabinetInstall surface="hermes_manual" />
          </section>

          <section className={styles.sec} id="start" aria-labelledby="start-title">
            <h2 id="start-title">Your first look</h2>
            <div className={styles.prose}>
              <p>Start Here shows what&apos;s in the Cabinet and where to begin.</p>
            </div>
            <ol className={styles.steps}>
              <li><b>The banner</b> shows Cabinet&apos;s 20 Bots and 11 Crew Kits. Press <Ui>Take the Fit Test</Ui> or <Ui>Browse The Cabinet</Ui> to begin.</li>
              <li><b>The five setups</b> run from the lightest to the heaviest. The Fit Test, a short quiz, picks the right one for your job.</li>
              <li><b>Six Bots</b> appear with their painted portraits. Each badge says <Ui>Tested</Ui> or <Ui>Not yet tested</Ui>.</li>
              <li><b>Learning Hermes</b> links to two community guides: Hermes Atlas and the Hermes Bible.</li>
              <li><b>The line at the bottom</b> says how fresh the Bot list is. Press <Ui>Refresh</Ui> to get the latest from botcabinet.com.</li>
            </ol>
            <Shot name="cabinet" width={1168} height={1366} title="The Cabinet" caption="The Cabinet tab shows all 20 Bots, and you can filter or search them by job." alt="The Cabinet tab: a grid of Bot portraits with names, one-line jobs and test badges, plus filters" />
          </section>

          <section className={styles.sec} id="fit" aria-labelledby="fit-title">
            <h2 id="fit-title">Bot or no Bot</h2>
            <div className={styles.prose}>
              <p>The Fit Test tells you how much setup a job really needs. Many jobs need less than a Bot.</p>
            </div>
            <ol className={styles.steps}>
              <li><b>Write the job in one sentence.</b> Or pick a common job on the right, which fills in every answer for you.</li>
              <li>
                <b>Answer five questions:</b>
                <ul>
                  <li>How often will you need it?</li>
                  <li>Should it remember past work?</li>
                  <li>Does it take more than one specialist?</li>
                  <li>Have you done it well by hand at least once?</li>
                  <li>Do you already have a Bot for it?</li>
                </ul>
                <p>You can also list anything it must never do under <Ui>Limits (optional)</Ui>.</p>
              </li>
              <li><b>Press <Ui>Find the right setup</Ui>.</b></li>
            </ol>
            <Shot name="fit" width={1168} height={1015} title="Fit Test" caption="You write the job in one sentence and answer five questions." alt="The Fit Test form: a job sentence, five questions with button choices, and common jobs on the right" />

            <h3>The five answers</h3>
            <ol className={styles.ladder}>
              {ladder.map(([title, copy]) => (
                <li key={title}><b>{title}</b><span>{copy}</span></li>
              ))}
            </ol>

            <h3>Reading your answer</h3>
            <div className={styles.prose}>
              <p>
                The answer names the setup and explains it in a sentence. On the right, <Ui>Why this answer</Ui> shows which
                of your answers led there. <Ui>Change answers</Ui> takes you back.
              </p>
              <p>Below that is a first test to try and what &quot;done&quot; looks like.</p>
            </div>
            <div className={styles.pair}>
              <Shot name="fit-answer-bot" width={1168} height={883} title="One Bot" caption="Cabinet shows the closest Bot, which you can add or use to plan your own." alt="A Fit Test answer of One Bot, with the closest published Bot, Daily Newspaper, and the reasons on the right" />
              <Shot name="fit-answer-crew" width={1168} height={1001} title="A crew" caption="Cabinet shows the closest crew, its steps, and a smaller way to start." alt="A Fit Test answer of A crew, with the Personal Planning Desk crew and its four steps" />
            </div>
          </section>

          <section className={styles.sec} id="add" aria-labelledby="add-title">
            <h2 id="add-title">Adding a Bot</h2>
            <div className={styles.prose}>
              <p>Adding a Bot makes it one of your Hermes bots. Nothing is made until you press the button.</p>
            </div>
            <ol className={styles.steps}>
              <li><b>Press <Ui>Add</Ui></b> on any Bot. The review screen opens.</li>
              <li><b>Check the names.</b> <Ui>Name</Ui> is what you&apos;ll see in your Bots list. <Ui>Profile name</Ui> is Hermes&apos;s short name for it, in lowercase letters, numbers and dashes.</li>
              <li><b>Read its instructions.</b> They say what the Bot does, what it needs from you, and when it must ask first. You can change any of it.</li>
              <li>
                <b>Read <Ui>What will be made</Ui>.</b>
                <ul>
                  <li>It uses the AI model and sign-in you already have.</li>
                  <li>It keeps the tools Hermes gives every new bot.</li>
                  <li>No schedule is turned on.</li>
                </ul>
                <p>Tick <Ui>Also give it Hermes&apos;s built-in skills</Ui> if you want them.</p>
              </li>
              <li><b>Press the Add button.</b> It shows the Bot&apos;s name, like <Ui>Add Daily Newspaper</Ui>. Hermes can take up to two minutes to set it up.</li>
            </ol>
            <Shot name="add-review" width={1168} height={1014} title="Review" caption="The review screen shows everything the new bot will get before it's made." alt="The Add Daily Newspaper review screen: name, profile name, description, editable instructions, and the What will be made panel" />

            <h3>Name already taken</h3>
            <div className={styles.prose}>
              <p>If you already have a bot with that name, Cabinet suggests a free one, like scout-2. Your existing bot stays as it is.</p>
            </div>
            <Shot name="add-name-taken" width={1168} height={542} title="Name taken" caption="Cabinet suggests a free name for the new bot." alt="A notice reading You already have a bot with that name, suggesting scout-2" />

            <h3>After you add it</h3>
            <div className={styles.prose}>
              <p>The Bot is now a normal Hermes bot. You can open a chat with it, see it in My Bots, or press <Ui>Undo this</Ui> to remove it.</p>
              <p>Start with its first test, a small job you run by hand. Set up a schedule in Hermes only once you trust the results.</p>
            </div>
            <Shot name="add-done" width={1168} height={506} title="Added" caption="The new bot is ready, with buttons to chat, see My Bots or undo." alt="Daily Newspaper is in your bots, with buttons to open a chat, see My Bots or undo" />
          </section>

          <section className={styles.sec} id="lab" aria-labelledby="lab-title">
            <h2 id="lab-title">Build your own</h2>
            <div className={styles.prose}>
              <p>When the Bot you need isn&apos;t in the Cabinet, Bot Lab helps you plan one, a line at a time.</p>
            </div>
            <ol className={styles.steps}>
              <li><b>Write its job in a sentence</b> and press <Ui>Start the plan</Ui>. You can also start from a published Bot, or press <Ui>Ask Hermes to help</Ui> to talk it through first.</li>
              <li>
                <b>Go through the ten lines of the plan:</b>
                <ul className={styles.columns}>
                  <li>Name</li><li>Its job</li><li>You give it</li><li>You get back</li><li>When it works</li>
                  <li>What it may use</li><li>Asks you before</li><li>First test</li><li>When it&apos;s unsure</li><li>What it remembers</li>
                </ul>
                <p>Each line is marked <Ui>Your words</Ui> or <Ui>Suggested</Ui>, so you can see what Cabinet filled in.</p>
              </li>
              <li><b>Check <Ui>What will be made</Ui></b> at the bottom. A red line lists anything still missing.</li>
              <li><b>Press <Ui>Create the Bot</Ui>,</b> or <Ui>Save as a kit</Ui> to keep the plan in My Bots for later.</li>
            </ol>
            <Shot name="lab" width={868} height={652} narrow title="Bot Lab" caption="One sentence starts the plan." alt="Bot Lab: Plan a new Bot, a job sentence box, and six published Bots to start from" />
            <div className={styles.pair}>
              <Shot name="lab-plan" width={868} height={460} title="The plan" caption="Change any line that isn't right." alt="The plan: Name, Its job, You give it, each tagged Your words or Suggested" />
              <Shot name="lab-made" width={868} height={390} title="What will be made" caption="The Bot is made from exactly what you see here." alt="What will be made: the Bot's name, model, when it runs, its profile name, and Create the Bot or Save as a kit" />
            </div>
          </section>

          <section className={styles.sec} id="crews" aria-labelledby="crews-title">
            <h2 id="crews-title">Bots that team up</h2>
            <div className={styles.prose}>
              <p>A Crew Kit is a team of Bots that pass work along in order. It stops at set points and waits for you to decide. Cabinet has 11 of them.</p>
              <p>Each Bot&apos;s instructions say what its step is, who it gets work from, and who it hands work to.</p>
            </div>
            <ol className={styles.steps}>
              <li><b>Open <Ui>Crew Kits</Ui>,</b> pick a crew and press <Ui>Set up</Ui>.</li>
              <li><b>Read <Ui>Who does what, in order</Ui>.</b> Work moves from the top down. A step marked <Ui>It stops here and waits for you</Ui> is where you decide.</li>
              <li><b>Check the bots.</b> If you already have a matching bot, Cabinet can use yours without changing it. Or you can make a new one.</li>
              <li><b>Read the limits.</b> They list what each bot must ask you about first and what it must never do. Cabinet writes them into every bot&apos;s instructions.</li>
              <li><b>Press the Set up button.</b> It shows the crew&apos;s name, like <Ui>Set up Personal Planning Desk</Ui>.</li>
            </ol>
            <Shot name="crew-order" width={1168} height={636} title="Handoff order" caption="The planner and you define the job, the researcher digs in, the coach checks it, and you decide." alt="Set up Personal Planning Desk: four steps in order, Define, Research, Check and Decide, two of them marked It stops here and waits for you" />
            <Shot name="crew-confirm" width={1168} height={356} title="Before you press" caption="The last screen shows the crew's limits and reminds you that you move the work along." alt="It asks you before, Off limits, a note that Hermes doesn't follow a crew's order by itself, and the Set up button" />

            <h3>You move the work</h3>
            <div className={styles.prose}>
              <p>Hermes doesn&apos;t pass work from one bot to the next by itself. You do that, either by asking each bot in turn or with Kanban cards, the task cards on Hermes&apos;s Kanban board.</p>
              <p>After setup, Cabinet can make one Kanban card per step, each given to the right bot. The cards wait in order, and nothing runs until you release the first one. You can make them later from My Bots too.</p>
              <p>Cabinet doesn&apos;t turn on schedules, connect accounts or send anything for a crew.</p>
            </div>

            <h3>Talking to the crew</h3>
            <div className={styles.prose}>
              <p>To talk a job through with every bot at once, start a Hermes group chat:</p>
              <ol>
                <li>Press the <strong>+</strong> next to Bots in the sidebar.</li>
                <li>Choose <strong>New group chat</strong>.</li>
                <li>Add the crew&apos;s bots.</li>
              </ol>
              <p>Every bot hears the conversation, and you can @mention one by name. A group chat has no set order, so use the Kanban cards for that.</p>
            </div>
            <Shot name="crew-done" width={1168} height={871} title="Crew set up" caption="Cabinet made three new bots and four Kanban cards, which wait until you release the first." alt="Personal Planning Desk is set up: three bots made, three steps to start a group chat, and four Kanban cards made, waiting until you release the first" />
          </section>

          <section className={styles.sec} id="mybots" aria-labelledby="mybots-title">
            <h2 id="mybots-title">Changing your mind</h2>
            <div className={styles.prose}>
              <p>My Bots lists everything Cabinet made for you: Bots, crews and saved plans. From here you can chat with them or remove them.</p>
            </div>
            <ol className={styles.steps}>
              <li><b><Ui>Made by Cabinet, not changed yet</Ui></b> means the bot is just as Cabinet made it. You can remove it.</li>
              <li><b><Ui>You&apos;ve changed it since Cabinet made it</Ui></b> means you edited it, so it&apos;s yours now and Cabinet leaves it alone. <Ui>Why it stays</Ui> shows what changed. You can still delete it in Hermes.</li>
              <li><b>To remove a bot,</b> press <Ui>Remove</Ui>, check the list, and press <Ui>Remove it</Ui>. <Ui>Keep it</Ui> backs out.</li>
              <li><b>Removing a crew</b> removes the bots Cabinet made for it and archives its Kanban cards. A bot of yours that the crew used stays.</li>
              <li><b>Saved kits</b> are plans from Bot Lab. Press <Ui>Make a bot from it</Ui> when you&apos;re ready.</li>
            </ol>
            <aside className={styles.note}>
              <ShieldCheck size={20} weight="thin" aria-hidden="true" />
              <p><b>Your other bots are safe.</b> Cabinet only removes bots it made that you haven&apos;t changed. A full history of what it has done is at the bottom of the page.</p>
            </aside>
            <Shot name="mybots" width={1168} height={875} title="My Bots" caption="Daily Newspaper can be removed, and Scout was edited, so it stays." alt="My Bots: Daily Newspaper with a Remove confirmation, Scout marked as changed, a crew, and a saved kit" />
          </section>

          <section className={styles.sec} id="records" aria-labelledby="records-title">
            <h2 id="records-title">How the Bots tested</h2>
            <div className={styles.prose}>
              <p>Test Records shows every test botcabinet.com has run on its Bots and crews, failures included.</p>
              <p>Each test is one practice task with made-up details. A pass is a good sign, but check a Bot&apos;s work yourself before you rely on it.</p>
              <p>Results read plainly, like <Ui>Passed twice</Ui> or <Ui>Not passed yet</Ui>, with a link to the full record.</p>
            </div>
            <Shot name="records" width={1168} height={1717} narrow title="Test Records" caption="These are the results as of October 15, 2026, and they change as new tests run." alt="Test Records: totals for 20 Bots and 11 Crew Kits, six tests that ran with their results, and one planned test" />
          </section>

          <section className={styles.sec} id="beside" aria-labelledby="beside-title">
            <h2 id="beside-title">Working with Hermes Bots</h2>
            <div className={styles.prose}>
              <p>Hermes is adding its own list of Bots, called Hermes Bots. If your Hermes has it, some Bots are in both places. For those, Cabinet walks you over to Hermes Bots to add them there, so you end up with just one copy.</p>
              <ul>
                <li><strong>To add one of those Bots,</strong> press <Ui>Add in Hermes Bots</Ui>. Hermes opens <Ui>Capabilities</Ui> at the <Ui>Bots</Ui> tab, and Cabinet tells you the name to pick there. If the tab doesn&apos;t open, go to Capabilities, then Bots, yourself.</li>
                <li><strong>In a crew,</strong> press <Ui>Open Hermes Bots</Ui>, add the Bot there, then press <Ui>Check again</Ui>. The crew uses the bot Hermes Bots added.</li>
                <li><strong>If you already added it,</strong> Cabinet shows <Ui>Already added through Hermes Bots</Ui>. Chat with it from your Bots list.</li>
                <li><strong>If Cabinet made a copy earlier,</strong> before your Hermes had Hermes Bots, My Bots points it out. Keep the copy you use and remove the other.</li>
              </ul>
              <p>Cabinet never changes or removes a bot you added through Hermes Bots. If your Hermes doesn&apos;t have Hermes Bots yet, Cabinet adds every Bot for you.</p>
            </div>
          </section>

          <section className={styles.sec} id="faq" aria-labelledby="faq-title">
            <h2 id="faq-title">Questions</h2>
            <div className={styles.faq}>
              <h3>Is Cabinet made by Nous Research?</h3>
              <p>Cabinet is an independent plugin developed by Damon Gardenhire. It is not an official plugin for Hermes made by Nous Research.</p>
              <h3>Which AI model will my new bots use?</h3>
              <p>The same one you use now. Hermes gives each new bot your current model and sign-in, and you can change it later in Hermes.</p>
              <h3>Will a Bot start doing things on its own?</h3>
              <p>No. A Bot works when you message it. Cabinet doesn&apos;t turn on schedules or connect accounts.</p>
              <h3>Does Cabinet send my information anywhere?</h3>
              <p>No. It only connects to botcabinet.com, to download the list of Bots. There&apos;s no tracking and no account to sign up for.</p>
              <h3>Can Cabinet see my passwords or keys?</h3>
              <p>No. Hermes sets up each new bot&apos;s sign-in, and Cabinet doesn&apos;t read or save it. Cabinet also stops if a Bot&apos;s instructions look like they contain a password or key.</p>
              <h3>What does Cabinet change on my computer?</h3>
              <p>
                It makes the bots you ask for, using Hermes&apos;s own tools, and keeps a small record of them. It doesn&apos;t run
                other programs, download code or update itself. Its{" "}
                <a href={`${CABINET_REPO_URL}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer">security notes on GitHub</a> have the details.
              </p>
              <h3>What if botcabinet.com is down?</h3>
              <p>Cabinet keeps working from the last list it saved, and the line at the bottom of the page says so.</p>
              <h3>How do I make Cabinet forget everything?</h3>
              <p>
                Delete Cabinet&apos;s record folder. On a Mac or Linux it&apos;s <code>~/.hermes/state/bot-cabinet-v2</code>, where ~
                means your home folder. On Windows it&apos;s <code>%LOCALAPPDATA%\hermes\state\bot-cabinet-v2</code>. Your bots
                stay where they are.
              </p>
            </div>
          </section>

          <section className={styles.sec} id="credits" aria-labelledby="credits-title">
            <h2 id="credits-title">Credits</h2>
            <ul className={styles.credits}>
              <li><b>Bot Cabinet</b>, by Damon Gardenhire, made the Bots, Crew Kits, painted portraits and test records. <Link href="/">botcabinet.com</Link></li>
              <li><b>The Daily Newspaper Bot</b> was inspired by Karen X. Cheng&apos;s The Morning Newspaper.</li>
              <li><b>The Hermes guides</b> linked in Cabinet were written by Shann&sup3;, YanXbt, Tony Simons and witcheer.</li>
              <li><b>The Diagnose an AI result skill</b> is based on Diagnose My Agent&apos;s Mistake, from Muse at Work.</li>
            </ul>
            <h3>Keep exploring</h3>
            <ul className={styles.credits}>
              <li><b>Hermes Agent</b> from Nous Research. <a href="https://hermes-agent.nousresearch.com" target="_blank" rel="noreferrer">hermes-agent.nousresearch.com</a></li>
              <li><b>The Hermes Bible</b>, by iamlukethedev. <a href="https://www.hermesbible.com/" target="_blank" rel="noreferrer">hermesbible.com</a></li>
              <li><b>Hermes Atlas</b>, by Kevin Simback. <a href="https://hermesatlas.com/" target="_blank" rel="noreferrer">hermesatlas.com</a></li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
