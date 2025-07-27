
const cache = new Map();

async function fetchWithClientId(url) {
  const clientId = process.env.REACT_APP_MANGADEX_CLIENT_ID;
  const headers = clientId ? { "x-client-id": clientId } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`MangaDex returned ${res.status} for ${url}`);
  return res.json();
}

export async function fetchWithCache(url) {
  if (cache.has(url)) return cache.get(url);
  const data = await fetchWithClientId(url);
  cache.set(url, data);
  return data;
}