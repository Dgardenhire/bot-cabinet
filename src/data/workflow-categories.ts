export const JOB_CATEGORIES = ["Home and family", "Business", "Writing", "Building", "Learning"] as const;
export type JobCategory = typeof JOB_CATEGORIES[number];
