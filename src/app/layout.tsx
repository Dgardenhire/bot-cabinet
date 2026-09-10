import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Space_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { FunnelAnalytics } from "@/components/funnel-analytics";
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
    "Choose, build, and use AI specialists for real work with practical Hermes Bot profiles, examples, setup help, and review information.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bot Cabinet Keeper · Limited workflow under test",
    description:
      "A continuing cloud Hermes agent for bounded site checks, evidence reports, and human-approved changes.",
    siteName: "Bot Cabinet",
    type: "website",
    url: "https://botcabinet.com",
    images: [
      {
        url: "/brand/social/bot-cabinet-keeper-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Bot Cabinet Keeper — a continuing agent for a continuing job",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bot Cabinet Keeper · Limited workflow under test",
    description:
      "Bounded site checks, evidence reports, and human approval before changes.",
    images: ["/brand/social/bot-cabinet-keeper-1200x630.jpg"],
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
        <Analytics />
      </body>
    </html>
  );
}
