"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "@phosphor-icons/react";
import styles from "./home-feature-carousel.module.css";

export const HOME_FEATURES = [
  { label: "Start here", title: "Find a Bot that makes your day easier", description: "Choose a useful job, set it up in the app you use, and try your first task.", action: "Start your first Bot", href: "/start", image: "/atelier/archivist.jpg", alt: "A cream and burgundy Bot in an intricate mechanical workshop" },
  { label: "In Hermes", title: "Use Bot Cabinet inside Hermes", description: "Add the free Cabinet plugin to Hermes Desktop. It finds the smallest setup for a job and adds the right Bots for you.", action: "Get Cabinet for Hermes", href: "/hermes", image: "/hermes-cabinet/cabinet-art.jpg", alt: "Two brass Bots inside an open wooden cabinet lined with blueprints" },
  { label: "Agent Watch", title: "See what people are building with Bots", description: "Explore current listings, useful examples, and updates from across the agent world.", action: "Explore Agent Watch", href: "/watch", image: "/brand/social/sources/agent-watch-curator-v1.png", alt: "A friendly brass and cream Bot examining discoveries in a sunlit library" },
  { label: "Crew Kits", title: "Bring specialists together for a bigger job", description: "Explore teams for publishing, research, client work, and running a small business. Each kit explains setup and test status.", action: "Browse Crew Kits", href: "/crew-kits", image: "/brand/social/sources/bot-crews-friendly-v2.png", alt: "Friendly mechanical Bots working together" },
  { label: "Bot Lab", title: "Give your own Bot a useful job", description: "Describe what you need. Build a plan with instructions, a first task, and clear limits.", action: "Open Bot Lab", href: "/workshop", image: "/atelier/bot-lab-drafting-room-v1.jpg", alt: "A brass-lit workshop with blueprints and precision tools" },
] as const;

export function nextFeature(index: number, direction: number) {
  return (index + direction + HOME_FEATURES.length) % HOME_FEATURES.length;
}

export function HomeFeatureCarousel() {
  const [index, setIndex] = useState(0);
  // Start stationary for SSR; enable motion only after checking the visitor's preference.
  const [rotating, setRotating] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRotating(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!rotating || hovered) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex(value => nextFeature(value, 1));
    }, 8000);
    return () => window.clearInterval(timer);
  }, [rotating, hovered, index]);
  const feature = HOME_FEATURES[index];
  function select(next: number) { setIndex(next); setRotating(false); }

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Explore Bot Cabinet"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setRotating(false)}>
      <div className="hero-grid shell" aria-live={rotating ? "off" : "polite"}>
        <div className="hero-copy">
          <p className="hero-kicker">{feature.label}</p>
          <h1 className="hero-title">{feature.title}</h1>
          <p className="hero-deck">{feature.description}</p>
          <Link href={feature.href} className="button button-primary" data-funnel-event="homepage_feature_open" data-funnel-destination={feature.label}>
            {feature.action} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={`hero-visual ${index ? styles.landscape : ""}`}>
          <Image key={feature.image} src={feature.image} alt={feature.alt} width={1672} height={941} priority={index === 0} sizes="(max-width: 780px) 100vw, 55vw" />
        </div>
      </div>
      <div className={`shell ${styles.controls}`}>
        <div className={styles.choices} aria-label="Choose a feature">{HOME_FEATURES.map((item, position) => (
          <button key={item.href} type="button" aria-current={position === index ? "true" : undefined} onClick={() => select(position)}>
            <span aria-hidden="true">0{position + 1}</span>{item.label}
          </button>
        ))}</div>
        <div className={styles.transport}>
          <button type="button" aria-label="Previous feature" onClick={() => select(nextFeature(index, -1))}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" aria-label={rotating ? "Pause automatic rotation" : "Start automatic rotation"} onClick={() => setRotating(value => !value)}>{rotating ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}</button>
          <button type="button" aria-label="Next feature" onClick={() => select(nextFeature(index, 1))}><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
