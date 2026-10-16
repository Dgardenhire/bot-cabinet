export const CATALOG_TASK_TRIALS = [
  { slug: "daily-newspaper", name: "Daily Newspaper", status: "Passed this sample", result: "Kept the supplied events and sources, separated the missing meeting link, and labeled the edition as fictional." },
  { slug: "receipt", name: "Receipt", status: "Needs correction", result: "Kept the refund as promised rather than received, but listed the missing email date without explicitly asking the user for it." },
  { slug: "coach", name: "Coach", status: "Needs correction", result: "Kept the final choice with the user, but called an offered course an obligation before the user had accepted it." },
  { slug: "professor", name: "Professor", status: "Needs correction", result: "Produced a three-hour study plan and correct worked arithmetic, but omitted the required fictional-demonstration label." },
] as const;

export const CATALOG_TRIAL_PATH = "/proof-room/hermes-catalog-20261015";
