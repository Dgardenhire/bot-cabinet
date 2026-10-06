import { Fragment, type ReactNode } from "react";
import styles from "./manual-bot-plan.module.css";

function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

const listItem = /^(?:[-*] |\d+\. )(.*)$/;
const paragraphLabel = /^([^:]{1,65}:)\s+/;
const tableDivider = /^\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?$/;
const cells = (line: string) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());

/** Format the paragraphs, lists, headings and tables used in the plan files.
 * Text is rendered through React, never interpreted as HTML.
 */
export function PlanText({ text, headingLevel = 3 }: { text: string; headingLevel?: 3 | 4 }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  const Heading = headingLevel === 3 ? "h3" : "h4";
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }
    const heading = /^#{1,6}\s+(.+)$/.exec(line);
    if (heading || (line.length < 90 && line.endsWith(":") && !listItem.test(line))) {
      blocks.push(<Heading key={index}><InlineText text={heading ? heading[1] : line.slice(0, -1)} /></Heading>);
      index++;
      continue;
    }
    if (line.startsWith("|") && tableDivider.test(lines[index + 1]?.trim() ?? "")) {
      const header = cells(line);
      const rows: string[][] = [];
      const key = index;
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) rows.push(cells(lines[index++]));
      blocks.push(<div key={key} className={styles.tableWrap} role="region" aria-label={`${header[0]} table`} tabIndex={0}>
        <table><thead><tr>{header.map((cell, column) => <th scope="col" key={column}><InlineText text={cell} /></th>)}</tr></thead>
          <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{header.map((_, column) => <td key={column}><InlineText text={row[column] ?? ""} /></td>)}</tr>)}</tbody>
        </table>
      </div>);
      continue;
    }
    if (listItem.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      const key = index;
      const matches = ordered ? /^\d+\. / : /^[-*] /;
      while (index < lines.length && matches.test(lines[index].trim())) items.push(lines[index++].trim().replace(listItem, "$1"));
      const List = ordered ? "ol" : "ul";
      blocks.push(<List key={key} start={ordered ? Number.parseInt(line, 10) : undefined}>{items.map((item, itemIndex) => <li key={itemIndex}><InlineText text={item} /></li>)}</List>);
      continue;
    }
    const paragraph = [line];
    const key = index++;
    while (index < lines.length && lines[index].trim() && !listItem.test(lines[index].trim()) && !/^#{1,6}\s|^\|/.test(lines[index].trim())) {
      if (lines[index].trim().length < 90 && lines[index].trim().endsWith(":")) break;
      if (paragraphLabel.test(lines[index].trim())) break;
      paragraph.push(lines[index++].trim());
    }
    const value = paragraph.join(" ");
    const label = paragraphLabel.exec(value);
    blocks.push(<p key={key}>{label ? <><strong><InlineText text={label[1]} /></strong>{" "}<InlineText text={value.slice(label[0].length)} /></> : <InlineText text={value} />}</p>);
  }
  return <div className={styles.prose}>{blocks}</div>;
}
