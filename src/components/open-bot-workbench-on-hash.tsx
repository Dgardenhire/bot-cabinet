"use client";

import { useEffect } from "react";

/** A resume link must reveal the workbench even when its platform choice starts closed. */
export function OpenBotWorkbenchOnHash() {
  useEffect(() => {
    let frame = 0;
    const reveal = () => {
      if (window.location.hash !== "#bot-workbench") return;
      const workbench = document.getElementById("bot-workbench");
      if (!workbench) return;
      const details = workbench.closest("details");
      if (!(details instanceof HTMLDetailsElement)) return;
      details.open = true;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => workbench.scrollIntoView({ block: "start" }));
    };

    reveal();
    window.addEventListener("hashchange", reveal);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", reveal);
    };
  }, []);

  return null;
}
