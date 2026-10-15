// api/dev-server.js
// Lightweight local development proxy server that serves /api/* serverless functions
// and forwards frontend requests to Parcel dev server (http://localhost:1234).

import http from 'http';
import { URL } from 'url';
import mangadexHandler from './mangadex.js';
import imageProxyHandler from './image-proxy.js';

const PORT = process.env.PORT || 3000;
const PARCEL_PORT = 1234;

function parseQuery(urlObj) {
  const query = {};
  urlObj.searchParams.forEach((val, key) => {
    if (query[key]) {
      if (Array.isArray(query[key])) {
        query[key].push(val);
      } else {
        query[key] = [query[key], val];
      }
    } else {
      query[key] = val;
    }
  });
  return query;
}

// Adapt Node http.ServerResponse to Express/Vercel response methods
function enhanceResponse(res) {
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (obj) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
    return res;
  };
  res.send = function (body) {
    if (Buffer.isBuffer(body)) {
      res.end(body);
    } else if (typeof body === 'object') {
      res.json(body);
    } else {
      res.end(String(body));
    }
    return res;
  };
}

const server = http.createServer(async (req, res) => {
  enhanceResponse(res);
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  req.query = parseQuery(parsedUrl);

  // Route /api/mangadex
  if (parsedUrl.pathname === '/api/mangadex') {
    return mangadexHandler(req, res);
  }

  // Route /api/image-proxy
  if (parsedUrl.pathname.startsWith('/api/image-proxy')) {
    return imageProxyHandler(req, res);
  }

  // Proxy all other routes to Parcel
  const proxyReq = http.request(
    {
      hostname: 'localhost',
      port: PARCEL_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', () => {
    res.status(502).json({
      error: 'Parcel dev server not reachable',
      hint: `Start Parcel in another terminal: npm run dev`,
    });
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`\n🚀 SKMangaNest Local Dev Proxy running at: http://localhost:${PORT}`);
  console.log(`   - MangaDex API: http://localhost:${PORT}/api/mangadex`);
  console.log(`   - Image Proxy:  http://localhost:${PORT}/api/image-proxy\n`);
});
