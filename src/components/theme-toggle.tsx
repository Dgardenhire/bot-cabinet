"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setTheme(currentTheme()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const nextTheme: Theme = theme === "light" ? "dark" : "light";

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("hbr-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      {nextTheme === "light" ? (
        <Sun size={16} weight="thin" aria-hidden="true" />
      ) : (
        <Moon size={16} weight="thin" aria-hidden="true" />
      )}
      <span>{nextTheme === "light" ? "Light" : "Dark"}</span>
    </button>
  );
}
