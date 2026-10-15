// api/mangadex.js
// Vercel serverless function to proxy MangaDex API requests
// Solves CORS and provides rate-limit friendly server-side caching

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Only GET is supported.' });
  }

  // Extract path and other query parameters
  const { path, ...queryParams } = req.query || {};

  if (!path) {
    return res.status(400).json({ 
      error: 'Missing path parameter',
      usage: '/api/mangadex?path=manga?limit=20'
    });
  }

  // Clean base URL: ensure no trailing slash to avoid double slash TCP drop
  const rawBaseUrl = process.env.MANGADEX_API || 'https://api.mangadex.org';
  const baseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

  // Clean path: strip leading slashes
  const cleanPath = String(path).trim().replace(/^\/+/, '');

  let targetUrl;
  try {
    targetUrl = new URL(`${baseUrl}/${cleanPath}`);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid URL constructed', details: err.message });
  }

  // Forward any additional query params not encoded directly into path
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => targetUrl.searchParams.append(key, v));
      } else {
        targetUrl.searchParams.set(key, value);
      }
    }
  });

  try {
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'SKMangaNest/2.0 (https://github.com/skameen36/manhwa-addict; contact: imameen36@gmail.com)',
    };

    const clientId = process.env.PARCEL_MANGADEX_CLIENT_ID || process.env.MANGADEX_CLIENT_ID;
    if (clientId) {
      headers['x-client-id'] = clientId;
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`MangaDex API error ${response.status} for ${targetUrl.toString()}: ${errorText.slice(0, 200)}`);
      return res.status(response.status).json({
        error: `MangaDex API responded with status ${response.status}`,
        details: errorText.slice(0, 300)
      });
    }

    const data = await response.json();

    // Cache responses (5 minutes on CDN edge, revalidate in background)
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);

  } catch (error) {
    console.error('MangaDex Proxy error:', error);
    return res.status(500).json({
      error: 'Failed to communicate with MangaDex API',
      message: error.message
    });
  }
}