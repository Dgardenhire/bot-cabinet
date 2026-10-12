import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StarterPackContent } from "./pack-content";
import type { StarterPack } from "@/lib/starter-pack-access";
const sample: StarterPack = {
 intro: ["Sample guide introduction"], pick: ["**Start small.** Use sample data."], ground_rules: ["Require human approval."],
 types: ["**Assignment:** One result", "**Skill:** Reusable method", "**Routine:** Scheduled", "**Bot:** Holds a role", "**Crew:** Shared work"], platforms: ["**Sample app:** Proposed setup only."],
 entries: Array.from({length:10}, (_,i)=>({id:`sample-${i}`,number:i+1,title:`Sample workflow ${i+1}`,subtitle:"Sample task",audience:"Sample reader",setup_time:"Planning estimate",bot_type:"Assignment. Start by hand.",app_fit:"Sample app",status:"Not yet tested by Bot Cabinet",where:"Use sample inputs",general:"Draft then review",prompt:"First line\n\nSecond line <sample>",first:"Check one result",guardrails:["Do not send"],watch:"Check the draft",tested:"Not yet tested by Bot Cabinet."}))
};
describe("formatted starter pack",()=>{
 const html=renderToStaticMarkup(createElement(StarterPackContent,{pack:sample}));
 it("keeps every setup in a labeled card with semantic metadata, prompt and safety sections",()=>{
  expect(html.match(/<article /g)).toHaveLength(10);expect(html.match(/<dl /g)).toHaveLength(10);expect(html.match(/<pre>/g)).toHaveLength(10);
  expect(html).toContain('aria-labelledby="sample-0-title"');expect(html).toContain('aria-label="Copy prompt 1"');expect(html).toContain("Try this first");expect(html).toContain("Never let it");
 });
 it("formats prose emphasis while preserving escaped, literal prompt line breaks",()=>{
  expect(html).toContain("<strong>Start small.</strong>");expect(html).not.toContain("**Sample app:");expect(html).toContain("First line\n\nSecond line &lt;sample&gt;");
 });
});


 it("uses job language while keeping the original guide anchors and test facts", () => {
  const entries = sample.entries.map((entry, i) => ({ ...entry, id: i === 8 ? "bot-morning-briefing" : entry.id, bot_type: "One-time job. Repeat when needed.", status: "Sample-data checked", tested: "Sample-data checked; scheduling has not been tested." }));
  const html = renderToStaticMarkup(createElement(StarterPackContent, { pack: { ...sample, entries } }));
  const text = html.replace(/<[^>]*>/g, "");
  expect(text).toContain("10 Useful Jobs for Your AI Assistant");
  expect(text).toContain("Copy-and-paste prompts, first steps, and safety tips.");
  expect(text).toContain("The ten jobs");
  expect(text).toContain("How to use it");
  expect(text).toContain("One-time job. Repeat when needed.");
  expect(text).toContain("What you need");
  expect(text).toContain("Sample-data checked; scheduling has not been tested.");
  expect(text).not.toMatch(/The ten Bots|first Bot|set up tonight|Bot Cabinet type|Where it runs/);
  expect(html).toContain('id="bot-morning-briefing"');
  expect(html).toContain('href="#bot-morning-briefing"');
  expect(html).toContain('id="pack-first-bot"');
  expect(html).not.toContain("_doors_");
  expect(html).toContain("First line\n\nSecond line &lt;sample&gt;");
 });
