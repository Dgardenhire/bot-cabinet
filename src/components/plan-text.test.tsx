import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PlanText } from "./plan-text";

describe("plan text formatting", () => {
  it("separates paragraphs, role headings, and numbered and bullet lists", () => {
    const html = renderToStaticMarkup(<PlanText text={"### Pulse\n\nFirst paragraph.\n\nSecond paragraph.\n\n1. Read\n2. Check\n\nUse this handoff:\n\n- Source:\n- Owner:"} />);
    expect(html).toContain("<h3>Pulse</h3>");
    expect(html).toContain("<p>First paragraph.</p><p>Second paragraph.</p>");
    expect(html).toContain('<ol start="1"><li>Read</li><li>Check</li></ol>');
    expect(html).toContain("<h3>Use this handoff</h3><ul><li>Source:</li><li>Owner:</li></ul>");
    expect(html).not.toContain("###");
  });
  it("renders sample tables with column headers and no divider text", () => {
    const html = renderToStaticMarkup(<PlanText text={"| Campaign | Cost |\n|---|---:|\n| A | $20 |\n| B | Unknown |"} />);
    expect(html).toContain('<th scope="col">Campaign</th>');
    expect(html).toContain("<td>A</td><td>$20</td>");
    expect(html).toContain("<td>B</td><td>Unknown</td>");
    expect(html).not.toContain("|---");
  });
  it("keeps nested headings below the surrounding sample heading", () => {
    expect(renderToStaticMarkup(<PlanText headingLevel={4} text={"### Result\n\nAnswer"} />)).toContain("<h4>Result</h4>");
  });
  it("separates consecutive labeled fields without needing blank lines", () => {
    const html = renderToStaticMarkup(<PlanText text={'Headline: Reminder software\nDescription: Sends appointment reminders.'} />);
    expect(html).toContain('<p><strong>Headline:</strong> Reminder software</p><p><strong>Description:</strong> Sends appointment reminders.</p>');
  });
  it("escapes HTML and preserves text inside emphasis, code, and tables", () => {
    const html = renderToStaticMarkup(<PlanText text={'**<script>bad</script>** and `<img src=x>`\n\n| Input | Result |\n|---|---|\n| <script> | <img> |'} />);
    expect(html).toContain("<strong>&lt;script&gt;bad&lt;/script&gt;</strong>");
    expect(html).toContain("<code>&lt;img src=x&gt;</code>");
    expect(html).toContain("<td>&lt;script&gt;</td>");
    expect(html).not.toContain("<script>");
  });
});
