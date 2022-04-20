let link;
export function save(blob: Blob, filename: string) {
  link = link || document.createElement("a");
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }

  link.href = URL.createObjectURL(blob);
  link.download = filename || "data.json";
  link.dispatchEvent(new MouseEvent("click"));
}

export function saveArrayBuffer(buffer: ArrayBuffer, filename: string) {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}

export function saveString(text: string, filename: string) {
  save(new Blob([text], { type: "text/plain" }), filename);
}
