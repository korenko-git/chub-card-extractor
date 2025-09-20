export const CONTENT_SCRIPT_MATCHES: string[] = [
  "*://chub.ai/*",
  "*://*.chub.ai/*",
];

export function urlMatches(url: string): boolean {
  return CONTENT_SCRIPT_MATCHES.some((pattern) => {
    const regex = new RegExp(
      "^" + pattern
        .replace(/\*/g, ".*")    // * → .*
        .replace(/\//g, "\\/")   // / → \/
      + "$"
    );
    return regex.test(url);
  });
}