export function downloadBlob(
  blob: Blob,
  fileName: string,
  openInNewTab = false,
) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  if (openInNewTab) {
    anchor.target = "_blank";
    anchor.rel = "noopener";
  }
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadMarkdown(value: string, fileName: string) {
  downloadBlob(
    new Blob([value], { type: "text/markdown;charset=utf-8" }),
    fileName,
  );
}
