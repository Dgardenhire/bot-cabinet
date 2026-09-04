"use client";

import { Moon, Sun } from "@phosphor-icons/react";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme: Theme = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("hbr-theme", nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <Sun className="theme-toggle-sun" size={16} weight="thin" aria-hidden="true" />
      <Moon className="theme-toggle-moon" size={16} weight="thin" aria-hidden="true" />
      <span className="theme-toggle-light-label">Light</span>
      <span className="theme-toggle-dark-label">Dark</span>
    </button>
  );
}
