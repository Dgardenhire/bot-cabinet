export const FIRST_BOT_RUN_EVENT = "first_bot_run_reported";
export const FIRST_BOT_RUN_OUTCOMES = ["worked", "stuck"] as const;

export type FirstBotRunOutcome = (typeof FIRST_BOT_RUN_OUTCOMES)[number];

export function buildFirstBotRunReport(outcome: FirstBotRunOutcome) {
  return {
    event: FIRST_BOT_RUN_EVENT,
    properties: { outcome },
  } as const;
}

export function sendFirstBotRunReport(
  outcome: FirstBotRunOutcome,
  send: (event: string, properties: { outcome: FirstBotRunOutcome }) => void,
) {
  const report = buildFirstBotRunReport(outcome);
  try {
    send(report.event, report.properties);
  } catch {
    // The answer remains visible in the interface when analytics is unavailable.
  }
  return report;
}
