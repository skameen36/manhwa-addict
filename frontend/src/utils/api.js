// frontend/src/utils/api.js
// Centralized API client with smart caching, in-flight deduplication, and hybrid local/cloud routing

const cache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const API_BASE = '/api/mangadex';

/**
 * Determines whether the current execution context is on localhost.
 */
function isLocalhost() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
}

/**
 * Builds candidate URLs for a MangaDex API endpoint.
 * MangaDex natively allows CORS from http://localhost:* (making local Parcel dev work out of the box),
 * while deployed domains (Vercel) route through the /api/mangadex serverless function.
 */
export function getUrlsToTry(pathOrUrl) {
  if (!pathOrUrl) return [];
  if (/^https?:\/\//i.test(pathOrUrl)) return [pathOrUrl];

  const clean = String(pathOrUrl).replace(/^\/+/, '');
  const directUrl = `https://api.mangadex.org/${clean}`;
  const proxyUrl = `${API_BASE}?path=${encodeURIComponent(clean)}`;

  // On localhost, prioritize direct MangaDex API (since MangaDex whitelists http://localhost:*)
  // On deployed domains (like Vercel), prioritize the Vercel serverless function /api/mangadex
  return isLocalhost() ? [directUrl, proxyUrl] : [proxyUrl, directUrl];
}

export function withBase(pathOrUrl) {
  const urls = getUrlsToTry(pathOrUrl);
  return urls[0] || pathOrUrl;
}

/**
 * Fetches JSON from candidate URLs with fallback, timeout, and descriptive error messages.
 */
async function fetchWithFallback(pathOrUrl) {
  const urls = getUrlsToTry(pathOrUrl);
  let lastError = null;

  for (const url of urls) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';

      // If response is HTML (e.g. Parcel dev server returning index.html for unknown /api route)
      if (contentType.includes('text/html')) {
        throw new Error(`Endpoint returned HTML instead of JSON (${url})`);
      }

      if (!res.ok) {
        const errorData = contentType.includes('application/json')
          ? await res.json().catch(() => ({}))
          : { details: await res.text().catch(() => '') };

        const message = errorData.error || errorData.details || `HTTP ${res.status}`;
        throw new Error(`API Error (${res.status}): ${message}`);
      }

      return await res.json();
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      // Try next candidate URL in fallback list
    }
  }

  throw lastError || new Error(`Failed to fetch data for ${pathOrUrl}`);
}

/**
 * Fetches data with in-flight deduplication and TTL-based caching.
 */
export async function fetchWithCache(pathOrUrl, { forceRefresh = false } = {}) {
  const cacheKey = String(pathOrUrl);
  const now = Date.now();

  if (!forceRefresh && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey);
    if (now - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
    cache.delete(cacheKey);
  }

  // Deduplicate simultaneous requests for the same key
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const data = await fetchWithFallback(pathOrUrl);
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

/**
 * Builds direct and proxy URLs for MangaDex cover art.
 */
export function getMangaCoverUrl(mangaId, coverFilename, size = '256') {
  if (!mangaId || !coverFilename) return null;
  const suffix = size ? `.${size}.jpg` : '';
  // Direct CDN URL (fast, zero serverless function overhead)
  return `https://uploads.mangadex.org/covers/${mangaId}/${coverFilename}${suffix}`;
}

/**
 * Builds direct chapter page image URL.
 */
export function getChapterPageUrl(baseUrl, hash, filename, dataSaver = false) {
  if (!baseUrl || !hash || !filename) return null;
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const mode = dataSaver ? 'data-saver' : 'data';
  return `${cleanBase}/${mode}/${hash}/${filename}`;
}

/**
 * Builds fallback proxy URL for any MangaDex asset if direct loading fails.
 */
export function getProxyImageUrl(fullUrl) {
  if (!fullUrl) return '';
  if (isLocalhost()) return fullUrl; // On localhost, direct images load natively
  return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`;
}
