import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Document, Link, Page } from "@react-pdf/renderer";
import { describe, expect, it } from "vitest";

import {
  RELIABLE_BOTS_PDF_OUTPUT_PATH,
  RELIABLE_BOTS_PDF_PAGE_CODES,
  ReliableBotsGuidePdf,
} from "./reliable-bots-guide-pdf";

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;
type FunctionElement = (props: { children?: ReactNode }) => ReactNode;

function renderFunctionElement(element: ElementWithChildren): ReactNode {
  return (element.type as FunctionElement)(element.props);
}

function collectElements(node: ReactNode): ElementWithChildren[] {
  if (Array.isArray(node)) return node.flatMap(collectElements);
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  if (typeof node.type === "function") {
    const rendered = renderFunctionElement(node);
    return [node, ...collectElements(rendered)];
  }
  return [node, ...Children.toArray(node.props.children).flatMap(collectElements)];
}

function collectText(node: ReactNode): string {
  if (Array.isArray(node)) return node.map(collectText).join(" ");
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!isValidElement<{ children?: ReactNode }>(node)) return "";
  if (typeof node.type === "function") return collectText(renderFunctionElement(node));
  return Children.toArray(node.props.children).map(collectText).join(" ");
}

describe("reliable Bots PDF source", () => {
  it("defines a six-page branded document without rendering it", () => {
    const document = ReliableBotsGuidePdf();
    expect(document.type).toBe(Document);
    expect(document.props.title).toBe("How to run Bots reliably");

    const pages = collectElements(document).filter((element) => element.type === Page);
    expect(pages).toHaveLength(6);
    expect(RELIABLE_BOTS_PDF_PAGE_CODES).toEqual([
      "THE JOB",
      "THE SHAPE",
      "THE GUARDRAILS",
      "THE TEST",
      "THE LOOP",
    ]);
  });

  it("contains the operating method, attribution and intended private output path", () => {
    const document = ReliableBotsGuidePdf();
    const text = collectText(document);
    const elements = collectElements(document);
    const sourceLinks = elements.filter((element) => element.type === Link);

    expect(text).toContain("Write a short job contract");
    expect(text).toContain("Choose a Bot, a skill or a routine");
    expect(text).toContain("Match freedom to possible harm");
    expect(text).toContain("Test failure before you trust success");
    expect(text).toContain("Use the simplest structure that can do the job");
    expect(text).toContain("It is not official xAI guidance");
    expect(sourceLinks).toHaveLength(1);
    expect(sourceLinks[0].props).toMatchObject({
      src: "https://github.com/unicodef1wn/grokbot-field-notes",
    });
    expect(RELIABLE_BOTS_PDF_OUTPUT_PATH).toBe(
      "output/pdf/how-to-run-bots-reliably.pdf",
    );
  });
});
