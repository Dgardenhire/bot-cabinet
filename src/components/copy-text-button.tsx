"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";

export function CopyTextButton({
  text,
  label = "Copy message",
  className = "",
  analyticsEvent,
  analyticsSurface,
}: {
  text: string;
  label?: string;
  className?: string;
  analyticsEvent?: string;
  analyticsSurface?: string;
}) {
  const [copied, setCopied] = useState(false);

  function copyWithFallback(value: string) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  }

  async function copyText() {
    try {
      let succeeded = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          succeeded = true;
        } catch {
          succeeded = false;
        }
      }
      if (!succeeded) succeeded = copyWithFallback(text);
      if (!succeeded) throw new Error("Clipboard unavailable");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className={`copy-text-button ${className}`.trim()}
      type="button"
      onClick={copyText}
      data-funnel-event={analyticsEvent}
      data-funnel-surface={analyticsSurface}
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copied ? "Copied" : label}
    </button>
  );
}
