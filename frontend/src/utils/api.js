// utils/api.js
const cache = new Map();
const BASE = (process.env.MANGADEX_API || "https://api.mangadex.org").replace(
  /\/+$/,
  ""
);

function withBase(pathOrUrl) {
  if (!pathOrUrl) return BASE;
  // if already absolute, leave it
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${BASE}/${String(pathOrUrl).replace(/^\/+/, "")}`;
}

async function fetchWithClientId(pathOrUrl) {
  const url = withBase(pathOrUrl);
  const clientId = process.env.PARCEL_MANGADEX_CLIENT_ID;
  const headers = { Accept: "application/json" };
  if (clientId) headers["x-client-id"] = clientId;

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
