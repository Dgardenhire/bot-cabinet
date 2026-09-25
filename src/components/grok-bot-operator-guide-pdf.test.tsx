import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Document, Link, Page } from "@react-pdf/renderer";
import { describe, expect, it } from "vitest";

import {
  GROK_OPERATOR_PDF_OUTPUT_PATH,
  GrokBotOperatorGuidePdf,
} from "./grok-bot-operator-guide-pdf";

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;
type FunctionElement = (props: { children?: ReactNode }) => ReactNode;

function rendered(element: ElementWithChildren): ReactNode {
  return (element.type as FunctionElement)(element.props);
}

function elements(node: ReactNode): ElementWithChildren[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  if (typeof node.type === "function") return [node, ...elements(rendered(node))];
  return [node, ...Children.toArray(node.props.children).flatMap(elements)];
}

function text(node: ReactNode): string {
  if (Array.isArray(node)) return node.map(text).join(" ");
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!isValidElement<{ children?: ReactNode }>(node)) return "";
  if (typeof node.type === "function") return text(rendered(node));
  return Children.toArray(node.props.children).map(text).join(" ");
}

describe("Grok Bot operator guide PDF", () => {
  it("defines a two-page branded document with primary-source links", () => {
    const document = GrokBotOperatorGuidePdf();
    expect(document.type).toBe(Document);
    expect(document.props.title).toBe("Grok Bot operator guide");

    const allElements = elements(document);
    expect(allElements.filter((element) => element.type === Page)).toHaveLength(2);
    expect(allElements.filter((element) => element.type === Link)).toHaveLength(5);
    expect(GROK_OPERATOR_PDF_OUTPUT_PATH).toBe(
      "public/downloads/guides/grok-bot-operator-guide.pdf",
    );
  });

  it("contains the operating rules and source limit", () => {
    const content = text(GrokBotOperatorGuidePdf());
    expect(content).toContain("Choose the right shape");
    expect(content).toContain("Protect accounts and files");
    expect(content).toContain("Use a group only when it helps");
    expect(content).toContain("THE FIVE-LINE HANDOFF");
    expect(content).toContain("not affiliated with xAI or Cursor");
  });
});
