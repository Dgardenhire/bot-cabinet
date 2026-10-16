import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CREW_PLANS } from "@/data/specialist-collection";
import { getStarterBot } from "@/data/starter-bots";
import { getSpecialistPortrait } from "@/data/specialist-portraits";
import styles from "./crew-plan-gallery.module.css";

export function CrewPlanGallery() {
  return <div className={styles.gallery}>{CREW_PLANS.map(plan => (
    <article className={styles.plan} key={plan.slug}>
      <Link href={`/crew-kits/${plan.slug}/`} className={styles.art} aria-label={`Explore ${plan.name}`}>
        {plan.roles.slice(0, 3).map(role => {
          const image = getSpecialistPortrait(role.slug)?.image ?? getStarterBot(role.slug)?.image;
          return image ? <Image key={role.slug} src={image} alt="" width={384} height={384} sizes="(max-width: 760px) 30vw, 14vw" /> : null;
        })}
      </Link>
      <span className={styles.type}>{plan.extends ? "New workflow" : "Crew plan"} · {plan.roles.length} specialists</span>
      <h3><Link href={`/crew-kits/${plan.slug}/`}>{plan.name}</Link></h3>
      <p>{plan.summary}</p>
      <p className={styles.members}>{plan.roles.map(role => role.name).join(" · ")}</p>
      <Link className="text-link" href={`/crew-kits/${plan.slug}/`}>See the task and setup <ArrowRight size={16} aria-hidden="true" /></Link>
    </article>
  ))}</div>;
}
