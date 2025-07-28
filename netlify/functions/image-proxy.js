const fetch = require("node-fetch");

exports.handler = async (event) => {
  const imagePath = event.path.replace("/.netlify/functions/image-proxy", "");
  const mangadexImageUrl = `https://uploads.mangadex.org${imagePath}`;

  try {
    const response = await fetch(mangadexImageUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch image from MangaDex CDN: ${response.statusText}`,
      };
    }

    // Read the image as a buffer
    const imageBuffer = await response.buffer();

    // Get the content type from the MangaDex response
    const contentType = response.headers.get("content-type");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream", // Fallback if no content-type
        "Cache-Control": "public, max-age=31536000, immutable", // Cache images aggressively
      },
      body: imageBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Error proxying image:", error);
    return {
      statusCode: 500,
      body: "Error proxying image.",
    };
  }
};
