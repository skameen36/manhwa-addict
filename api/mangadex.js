// api/mangadex.js
// Vercel serverless function to proxy MangaDex API requests
// This solves CORS issues by making requests from the server side

export default async (req, res) => {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { path, ...queryParams } = req.query;

  if (!path) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  // Build the MangaDex API URL
  const baseUrl = process.env.MANGADEX_API || 'https://api.mangadex.org';
  const url = new URL(`${baseUrl}${path.startsWith('/') ? path : '/' + path}`);

  // Add query parameters
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key]) {
      url.searchParams.append(key, queryParams[key]);
    }
  });

  try {
    // Prepare headers
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'SKMangaNest/1.0 (https://skmanganest.vercel.app)',
    };

    // Add client ID if available
    const clientId = process.env.PARCEL_MANGADEX_CLIENT_ID;
    if (clientId) {
      headers['x-client-id'] = clientId;
    }

    // Make the request to MangaDex
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`MangaDex API error: ${response.status} for ${url.toString()}`);
      res.status(response.status).json({
        error: `MangaDex API error: ${response.statusText}`,
        details: errorText.slice(0, 200)
      });
      return;
    }

    // Get response data
    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

    // Return the data
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};