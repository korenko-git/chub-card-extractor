export function formatDate(iso: string): string {
  const date = new Date(iso);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24h
  });
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}