// frontend/src/utils/api.js
// Centralized API client with smart caching, in-flight deduplication, and image URL builders

const cache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const API_BASE = '/api/mangadex';

/**
 * Builds the proxy URL for a MangaDex API endpoint.
 */
export function withBase(pathOrUrl) {
  if (!pathOrUrl) return API_BASE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const clean = String(pathOrUrl).replace(/^\/+/, '');
  return `${API_BASE}?path=${encodeURIComponent(clean)}`;
}

/**
 * Fetches JSON from MangaDex proxy with timeout and informative errors.
 */
async function fetchFromProxy(pathOrUrl) {
  const url = withBase(pathOrUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      const errorData = contentType.includes('application/json')
        ? await res.json().catch(() => ({}))
        : { details: await res.text().catch(() => '') };

      const message = errorData.error || errorData.details || `HTTP ${res.status}`;
      throw new Error(`API Error (${res.status}): ${message}`);
    }

    if (!contentType.includes('application/json')) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `Unexpected response format (${contentType || 'empty'}). Please ensure Vercel serverless functions are active. Snippet: ${text.slice(0, 100)}`
      );
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw err;
  }
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
      const data = await fetchFromProxy(pathOrUrl);
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
  return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`;
}
