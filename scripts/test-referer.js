// scripts/test-referer.js
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();

  page.on('response', async (res) => {
    if (res.request().resourceType() === 'image') {
      const buffer = await res.body();
      console.log('Image fetched URL:', res.url());
      console.log('Image response status:', res.status());
      console.log('Image byte size:', buffer.length);
    }
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="referrer" content="no-referrer">
      </head>
      <body>
        <img id="test-img" referrerpolicy="no-referrer" src="https://uploads.mangadex.org/covers/f6ce20ca-73c3-4fdd-9367-e2901fca780e/fbf55840-15be-4ebd-86fc-4af2fa0368f7.jpg.256.jpg">
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(3000);

  const imgInfo = await page.evaluate(() => {
    const img = document.getElementById('test-img');
    return {
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
    };
  });

  console.log('Image Info in Chrome:', imgInfo);

  await browser.close();
}

main().catch(console.error);
