// utils/api.js
const cache = new Map();
const BASE = '/api/mangadex';

function withBase(pathOrUrl) {
  if (!pathOrUrl) return BASE;
  // if already absolute, leave it
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${BASE}?path=${encodeURIComponent(String(pathOrUrl).replace(/^\/+/, ""))}`;
}

async function fetchWithClientId(pathOrUrl) {
  const url = withBase(pathOrUrl);
  const headers = { Accept: "application/json" };

  const res = await fetch(url, { headers });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MangaDex ${res.status} for ${url}. ${text.slice(0, 120)}`);
  }
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Expected JSON, got ${ct} from ${url}. Snip: ${text.slice(0, 120)}`
    );
  }
  return res.json();
}

export async function fetchWithCache(pathOrUrl) {
  if (cache.has(pathOrUrl)) return cache.get(pathOrUrl);
  const data = await fetchWithClientId(pathOrUrl);
  cache.set(pathOrUrl, data);
  return data;
}
