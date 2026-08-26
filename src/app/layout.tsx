import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Space_Mono } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://botcabinet.com"),
  title: {
    default: "Bot Cabinet",
    template: "%s — Bot Cabinet",
  },
  description:
    "Bot Cabinet helps people find, understand, and build useful Hermes Bots through The Cabinet, Bot Crews workflows, Bot Lab, the Field Manual, and the Community Registry.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Bot Cabinet",
    description:
      "Find useful Hermes Bots in The Cabinet, build a plan in Bot Lab, follow Bot Crews workflows, and inspect selected Community Registry projects.",
    siteName: "Bot Cabinet",
    type: "website",
    url: "https://botcabinet.com",
    images: [
      {
        url: "/brand/bot-cabinet-og-launch-v1-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Bot Cabinet — a refined cabinet of useful AI Bots",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bot Cabinet",
    description:
      "Discover, create, and learn how to use practical Hermes Bots.",
    images: ["/brand/bot-cabinet-og-launch-v1-1200x630.png"],
  },
};

const themeBootstrap = `
  (function () {
    try {
      var saved = localStorage.getItem("hbr-theme");
      var theme = saved === "light" || saved === "dark"
        ? saved
        : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {
      document.documentElement.dataset.theme = "dark";
    }
  })();
`;

const cabinetRevealBootstrap = `
  (function () {
    try {
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var shouldRun = !reduceMotion;
      document.documentElement.dataset.cabinetReveal = shouldRun ? "run" : "skip";
    } catch (_) {
      document.documentElement.dataset.cabinetReveal = "skip";
    }
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${dmSerif.variable} ${spaceMono.variable}`}>
      <body>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
        <Script id="cabinet-reveal-bootstrap" strategy="beforeInteractive">
          {cabinetRevealBootstrap}
        </Script>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
