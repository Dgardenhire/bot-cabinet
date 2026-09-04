import {
  CheckCircle,
  ClipboardText,
  ClockCountdown,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";

import type { PortableBotPackV2 } from "@/lib/portable-bot-pack-v2";

import { Eyebrow } from "./ui";

export function BotPackV2Panel({ pack }: { pack: PortableBotPackV2 }) {
  const skill = pack.skills[0];
  const routine = pack.routines[0];

  return (
    <section
      className="bot-pack-v2"
      aria-labelledby={`${pack.identity.slug}-bot-pack-v2-heading`}
    >
      <div className="bot-pack-v2-heading">
        <div>
          <Eyebrow>Bot Pack 2.0</Eyebrow>
          <h2 id={`${pack.identity.slug}-bot-pack-v2-heading`}>
            Put {pack.identity.name} to work
          </h2>
        </div>
        <p>
          This versioned pack keeps the Bot&apos;s job, first assignment,
          success checkpoint, reusable Skill, planned Routine, and platform
          setup files together.
        </p>
      </div>

      <div className="bot-pack-v2-job">
        <article>
          <div className="bot-pack-v2-label">
            <ClipboardText size={21} weight="thin" aria-hidden="true" />
            <span>First assignment</span>
          </div>
          <p>{pack.job.firstMission}</p>
        </article>
        <article>
          <div className="bot-pack-v2-label">
            <CheckCircle size={21} weight="thin" aria-hidden="true" />
            <span>Review checkpoint</span>
          </div>
          <p>{pack.job.checkpoint}</p>
        </article>
      </div>

      <div className="bot-pack-v2-recipes">
        <article>
          <div>
            <Wrench size={22} weight="thin" aria-hidden="true" />
            <span className="bot-platform-status is-prepared">
              Prepared · test pending
            </span>
          </div>
          <p className="bot-pack-v2-kicker">Reusable Skill</p>
          <h3>{skill.name}</h3>
          <p>{skill.whenToUse}</p>
          <strong>Produces</strong>
          <ul>
            {skill.outputs.map((output) => (
              <li key={output}>{output}</li>
            ))}
          </ul>
        </article>

        <article>
          <div>
            <ClockCountdown size={22} weight="thin" aria-hidden="true" />
            <span className="bot-platform-status">
              Manual test required
            </span>
          </div>
          <p className="bot-pack-v2-kicker">Planned Routine</p>
          <h3>{routine.name}</h3>
          <p>{routine.trigger}</p>
          <strong>Before scheduling</strong>
          <p>{routine.failureHandling}</p>
        </article>
      </div>

      <p className="bot-pack-v2-note">
        The Skill and Routine are prepared plans. Test them with sample
        material and approve the results before adding a schedule or outside
        access.
      </p>
    </section>
  );
}
