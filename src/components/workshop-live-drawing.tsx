import {
  CheckCircle,
  Circuitry,
  Clock,
  Crosshair,
  Package,
  Pulse,
  Robot,
  ShieldCheck,
  TrayArrowDown,
  Wrench,
  type Icon,
} from "@phosphor-icons/react";

import type { BotBlueprint } from "@/lib/workshop";

type WorkshopLiveDrawingProps = {
  blueprint: BotBlueprint;
};

type DrawingModule = {
  label: string;
  detail: string;
  ready: boolean;
  icon: Icon;
};

function itemCount(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function WorkshopLiveDrawing({ blueprint }: WorkshopLiveDrawingProps) {
  const missingFields = new Set(blueprint.missingFields);
  const isReady = (field: string) => !missingFields.has(field);
  const nameReady = isReady("Bot name");
  const missionReady = isReady("Job and outcome");
  const inputsReady = isReady("Information and rules");
  const outputsReady = isReady("What it should produce");
  const cadenceReady = isReady("When it should run");
  const toolsReady = isReady("Tools and outside services");
  const approvalsReady = isReady("When it must ask you");
  const testReady = isReady("First test");
  const modules: DrawingModule[] = [
    {
      label: "Bot name",
      detail: nameReady ? "Name added" : "Name needed",
      ready: nameReady,
      icon: Robot,
    },
    {
      label: "Job and outcome",
      detail: missionReady ? "Outcome added" : "Outcome needed",
      ready: missionReady,
      icon: Crosshair,
    },
    {
      label: "Information and rules",
      detail: inputsReady
        ? itemCount(blueprint.inputs.length, "information item")
        : "Information needed",
      ready: inputsReady,
      icon: TrayArrowDown,
    },
    {
      label: "Intended result",
      detail: outputsReady
        ? itemCount(blueprint.outputs.length, "result")
        : "Result needed",
      ready: outputsReady,
      icon: Package,
    },
    {
      label: "When work starts",
      detail: cadenceReady ? "Timing added" : "Timing needed",
      ready: cadenceReady,
      icon: Clock,
    },
    {
      label: "Tools and services",
      detail: toolsReady
        ? itemCount(blueprint.tools.length, "tool")
        : "Tools needed",
      ready: toolsReady,
      icon: Wrench,
    },
    {
      label: "Approval required",
      detail: approvalsReady
        ? itemCount(blueprint.approvals.length, "approval item")
        : "Approval items needed",
      ready: approvalsReady,
      icon: ShieldCheck,
    },
    {
      label: "First test",
      detail: testReady ? "Test added" : "Test needed",
      ready: testReady,
      icon: CheckCircle,
    },
  ];

  const nextModuleIndex = modules.findIndex((module) => !module.ready);
  const drawingComplete =
    blueprint.completedFields === blueprint.totalFields && nextModuleIndex === -1;
  const nextModule = drawingComplete ? null : modules[nextModuleIndex];
  const drawingState = drawingComplete
    ? "All 8 fields filled"
    : `${blueprint.completedFields} of ${blueprint.totalFields} fields filled`;

  return (
    <section className="workshop-live-drawing" aria-labelledby="workshop-live-drawing-heading">
      <header className="workshop-live-drawing-header">
        <p>
          <Circuitry size={17} weight="regular" aria-hidden="true" />
          Bot plan at a glance
        </p>
        <span className={drawingComplete ? "is-complete" : undefined} aria-live="polite">
          <Pulse size={15} weight="bold" aria-hidden="true" />
          {drawingState}
        </span>
      </header>

      <div className="workshop-live-drawing-core">
        <span className="workshop-live-drawing-core-icon" aria-hidden="true">
          <Robot
            size={42}
            weight={blueprint.completedFields > 0 ? "duotone" : "thin"}
          />
        </span>
        <div className="workshop-live-drawing-core-copy">
          <span>
            Bot plan · {blueprint.completedFields}/{blueprint.totalFields} fields filled
          </span>
          <h3 id="workshop-live-drawing-heading">{blueprint.profile.name}</h3>
          <p>{nextModule ? `Next: ${nextModule.label}` : "Review all eight fields before use."}</p>
        </div>
        <progress
          value={blueprint.completedFields}
          max={blueprint.totalFields}
          aria-label={`${blueprint.completedFields} of ${blueprint.totalFields} Bot Lab fields filled`}
        />
      </div>

      <ol className="workshop-live-drawing-modules">
        {modules.map((module, index) => {
          const ModuleIcon = module.icon;
          const isCurrent = index === nextModuleIndex;
          const className = [
            "workshop-live-drawing-module",
            module.ready ? "is-ready" : "",
            isCurrent ? "is-current" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li className={className} key={module.label} aria-current={isCurrent ? "step" : undefined}>
              <span className="workshop-live-drawing-module-icon" aria-hidden="true">
                <ModuleIcon size={21} weight={module.ready ? "duotone" : "regular"} />
              </span>
              <span className="workshop-live-drawing-module-copy">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{module.label}</strong>
                <small>{module.detail}</small>
              </span>
              <span className="workshop-live-drawing-module-state">
                {module.ready ? "Added" : isCurrent ? "Next" : "Later"}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
