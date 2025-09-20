const host = 'https://gateway.chub.ai';

function getToken(): string | null {
  return (
    localStorage.getItem('URQL_TOKEN') ||
    sessionStorage.getItem('URQL_TOKEN') ||
    null
  );
}

export const makeRequest = async (url: string) => {
  try {
    const apiUrl = `${host}/api/${url}`;
    console.log('Fetching JSON from:', apiUrl);

    const headers = new Headers({
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5"
    });

    const token = getToken();
    if (token) {
      headers.set("private-token", token);
      headers.set("samwise", token);
      headers.set("CH-API-KEY", token);
    }

    const response = await fetch(apiUrl, {
      credentials: "omit",
      headers,
      referrer: window.location.href,
      method: "GET",
      mode: "cors"
    });

    if (response.status !== 200) {
      console.error('Failed to fetch JSON, status:', response.status);
    }

    return response;
  } catch (error) {
    console.error('Error fetching JSON:', error);
    return null;
  }
};
