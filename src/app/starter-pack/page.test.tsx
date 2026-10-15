import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import StarterPackPage, { metadata } from "./page";
import { StarterPackInvitation } from "@/components/starter-pack-invitation";
describe("starter pack landing page", () => {
 const html = renderToStaticMarkup(createElement(StarterPackPage));
 it("requires signup without embedding pack content", () => {
  expect(html).toContain("<form"); expect(html).toContain("Subscribe and get the starter pack");
  expect(html).not.toContain("<article"); expect(html).not.toContain("<pre"); expect(html).not.toContain("Copy prompt");
 });
 it("explains the existing weekly newsletter and subscriber gifts", () => {
  expect(html).toContain("One email on Mondays"); expect(html).toContain("Already subscribed?"); expect(html).toContain("https://ai-seminar.linchpin.studio/open-source");
 });
});


describe("starter pack language", () => {
 it("describes jobs and prompts without promising installed bots", () => {
  const html = renderToStaticMarkup(createElement(StarterPackPage));
  const text = html.replace(/<[^>]*>/g, "");
  expect(text).toContain("10 Useful Jobs for Your AI Assistant");
  expect(text).toContain("Copy-and-paste prompts, first steps, and safety tips.");
  expect(text).toContain("ongoing or scheduled work needs separate setup");
  expect(text).not.toMatch(/ten (?:small, useful )?bots|10 Bots|set up tonight|Pick a Bot|ten Bot setups/i);
  expect(html).not.toContain("_doors_");
  expect(text).toContain("App connections, scheduling, and use in other apps have not been tested");
 });
});

 it("uses the same title and honest scope in metadata and invitations", () => {
  expect(metadata.title).toBe("10 Useful Jobs for Your AI Assistant");
  expect(metadata.description).toContain("ten everyday jobs");
  const html = renderToStaticMarkup(createElement(StarterPackInvitation));
  expect(html).toContain("10 Useful Jobs for Your AI Assistant");
  expect(html).toContain("Copy-and-paste prompts, first steps, and safety tips.");
  expect(html).toMatch(/href="\/starter-pack\/?"/);
  expect(html).not.toMatch(/ten Bot setups|one useful Bot/);
 });

it("uses the starter pack artwork with its actual dimensions for social previews", () => {
 const image = "https://ai-seminar.linchpin.studio/images/bot-cabinet-starter-pack.jpg";
 expect(metadata.openGraph.images).toEqual([{
  url: image,
  width: 1440,
  height: 810,
  alt: "Bot Cabinet Starter Pack: 10 practical AI workflows to try, with a dark teal field guide and ivory workflow cards.",
 }]);
 expect(metadata.twitter).toMatchObject({
  card: "summary_large_image",
  images: [image],
 });
});
