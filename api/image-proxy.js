// api/image-proxy.js
// Vercel Serverless Function to proxy MangaDex covers and chapter images safely

const ALLOWED_HOSTS = [
  'uploads.mangadex.org',
  'api.mangadex.org',
  'mangadex.network',
];

function isHostAllowed(hostname) {
  return ALLOWED_HOSTS.some(allowed => 
    hostname === allowed || hostname.endsWith(`.${allowed}`)
  );
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let targetUrlString = '';

    // Check if full URL provided in query
    if (req.query?.url) {
      targetUrlString = decodeURIComponent(String(req.query.url));
    } else {
      // Subpath extraction: /api/image-proxy/covers/... or req.query.path
      const rawPath = req.query?.path || (req.url || '').replace(/^\/api\/image-proxy\/?/, '');
      const cleanPath = String(rawPath).replace(/^\/+/, '');

      if (!cleanPath) {
        return res.status(400).json({ 
          error: 'Missing image path or url',
          usage: '/api/image-proxy?url=https://uploads.mangadex.org/covers/... or /api/image-proxy?path=covers/...'
        });
      }

      if (/^https?:\/\//i.test(cleanPath)) {
        targetUrlString = cleanPath;
      } else {
        targetUrlString = `https://uploads.mangadex.org/${cleanPath}`;
      }
    }

    const targetUrl = new URL(targetUrlString);
    if (!isHostAllowed(targetUrl.hostname)) {
      return res.status(403).json({ error: 'Host not allowed for proxying' });
    }

    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'SKMangaNest/2.0 (https://github.com/skameen36/manhwa-addict)',
        'Referer': 'https://mangadex.org/',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch image: ${response.statusText}`,
        status: response.status
      });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, immutable');
    return res.status(200).send(buffer);

  } catch (error) {
    console.error('Image proxy error:', error);
    return res.status(500).json({
      error: 'Error proxying image',
      message: error.message
    });
  }
}
