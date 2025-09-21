// Simplified fetch utility for extension context

export async function fetchWithCorsHandling(url: string, options: RequestInit = {}): Promise<Response | null> {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      ...options
    });
    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
}