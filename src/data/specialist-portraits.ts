import specialists from "./specialist-index.json";

export const SPECIALIST_PORTRAITS = Object.fromEntries(
  specialists.map(bot => [bot.slug, {
    image: `/bot-portraits/specialists/${bot.slug}.webp`,
    alt: `A friendly enamel-and-brass robot illustrating ${bot.name}`,
  }]),
);

export function getSpecialistPortrait(slug: string) {
  return SPECIALIST_PORTRAITS[slug];
}
