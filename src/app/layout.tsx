import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Space_Mono } from "next/font/google";
import Script from "next/script";
import { FunnelAnalytics, SiteAnalytics } from "@/components/funnel-analytics";
import { ReturningUseAnalytics } from "@/components/returning-use-analytics";
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
    "AI bot templates with setup steps for ChatGPT, Claude, Grok Bot and Hermes Agent, plus a guide for Gemini. Each Bot shows how far it has been tested.",
  openGraph: {
    title: "Bot Cabinet",
    description:
      "AI bot templates with setup steps for ChatGPT, Claude, Grok Bot and Hermes Agent, plus a guide for Gemini. Each Bot shows how far it has been tested.",
    siteName: "Bot Cabinet",
    type: "website",
    url: "https://botcabinet.com",
    images: [
      {
        url: "/brand/bot-cabinet-launch-card-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Bot Cabinet — a cabinet of useful AI Bots",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bot Cabinet",
    description:
      "AI bot templates with setup steps for ChatGPT, Claude, Grok Bot and Hermes Agent, plus a guide for Gemini. Each Bot shows how far it has been tested.",
    images: ["/brand/bot-cabinet-launch-card-1200x630.jpg"],
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmSerif.variable} ${spaceMono.variable}`}
    >
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
        <FunnelAnalytics />
        <ReturningUseAnalytics />
        <SiteAnalytics />
      </body>
    </html>
  );
}
