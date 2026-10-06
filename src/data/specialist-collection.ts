import collection from "../../public/downloads/specialists/collection.json";

export const SPECIALISTS = collection.bots;
export const CREW_PLANS = collection.crews;
export const getSpecialist = (slug: string) => SPECIALISTS.find(bot => bot.slug === slug);
export const getCrewPlan = (slug: string) => CREW_PLANS.find(crew => crew.slug === slug);
export type Specialist = typeof SPECIALISTS[number];
export type CrewPlan = typeof CREW_PLANS[number];
