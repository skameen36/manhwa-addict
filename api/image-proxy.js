// File: api/image-proxy.js
// This will be a Vercel Serverless Function.
// Vercel automatically detects files in the 'api' directory as functions.

// Make sure 'node-fetch' is installed in your project's package.json
// npm install node-fetch@2 (if not already)

module.exports = async (req, res) => {
  // Extract the original image path from the Vercel Function request
  // Example req.url: /api/image-proxy/covers/mangaId/filename.jpg
  // We want: /covers/mangaId/filename.jpg or /data/hash/filename
  const imagePath = req.url.replace("/api/image-proxy", ""); // Adjust this if your proxy path changes

  const mangadexImageUrl = `https://uploads.mangadex.org${imagePath}`;

  try {
    // Fetch the image from MangaDex CDN
    const response = await fetch(mangadexImageUrl);

    if (!response.ok) {
      console.error(
        `MangaDex CDN returned ${response.status} for ${mangadexImageUrl}`
      );
      // Send a fallback image or an error response
      res.writeHead(response.status, { "Content-Type": "text/plain" });
      res.end(
        `Failed to fetch image from MangaDex CDN: ${response.statusText}`
      );
      return;
    }

    // Get the content type from the MangaDex response headers
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Set appropriate headers for the response
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable", // Cache images aggressively
      "Access-Control-Allow-Origin": "*", // Allow CORS if needed
    });

    // Pipe the image stream directly to the response
    response.body.pipe(res);
  } catch (error) {
    console.error("Error proxying image:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error proxying image.");
  }
};
