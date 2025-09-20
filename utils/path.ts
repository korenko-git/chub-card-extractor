
export function extractAuthor(fullPath: string): string {
  const parts = fullPath.split("/");
  return parts.length >= 2 ? parts[parts.length - 2] : "";
}

export function extractName(fullPath: string): string {
  const parts = fullPath.split("/");
  return parts.length >= 2 ? parts[parts.length - 1] : "";
}

export function extractFullUrl(fullPath: string): string {
  const parts = fullPath.split("/");
  return parts.length >= 2 ? "https://chub.ai/" + (parts[parts.length - 3] || "characters") + "/" + parts[parts.length - 2] + "/" + parts[parts.length - 1] : "";
}