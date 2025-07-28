// netlify/functions/image-proxy.js
const fetch = require("node-fetch"); // Make sure node-fetch is in your package.json dependencies!

exports.handler = async (event) => {
  // event.path for /image-proxy/covers/ID/FILE.jpg will be /.netlify/functions/image-proxy/covers/ID/FILE.jpg
  const imagePath = event.path.replace("/.netlify/functions/image-proxy", "");
  const mangadexImageUrl = `https://uploads.mangadex.org${imagePath}`;

  try {
    const response = await fetch(mangadexImageUrl);

    if (!response.ok) {
      console.error(
        `MangaDex CDN returned ${response.status} for ${mangadexImageUrl}`
      );
      return {
        statusCode: response.status,
        body: `Failed to fetch image: ${response.statusText}`,
      };
    }

    const imageBuffer = await response.buffer();
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Aggressive caching for images
        // Potentially add CORS headers if needed for very strict clients, but usually not for img src
        "Access-Control-Allow-Origin": "*",
      },
      body: imageBuffer.toString("base64"), // Send as base64 string
      isBase64Encoded: true, // Tell Netlify to decode base64
    };
  } catch (error) {
    console.error("Error proxying image:", error);
    return {
      statusCode: 500,
      body: "Error proxying image.",
    };
  }
};
