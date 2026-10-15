// scripts/test-browser.js
import { chromium } from 'playwright';
import path from 'path';

async function run() {
  console.log('Launching headless Chrome...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const consoleLogs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  console.log('Navigating to http://localhost:1234 ...');
  await page.goto('http://localhost:1234', { waitUntil: 'domcontentloaded' });

  // Wait 4 seconds for API requests and rendering
  await page.waitForTimeout(4000);

  const title = await page.title();
  console.log('Page Title:', title);

  // Check for any error overlay
  const overlayText = await page.evaluate(() => {
    const overlay = document.querySelector('parcel-error-overlay');
    return overlay ? overlay.shadowRoot?.textContent || overlay.textContent : null;
  });

  if (overlayText) {
    console.error('Parcel Error Overlay Detected:', overlayText);
  } else {
    console.log('No error overlay detected!');
  }

  // Check manga cards count
  const mangaCardsCount = await page.locator('.manga-card').count();
  console.log('Manga cards rendered on page:', mangaCardsCount);

  // Check spotlight hero
  const heroTitle = await page.locator('.hero-title').textContent().catch(() => null);
  console.log('Hero Spotlight Title:', heroTitle);

  // Check sidebar items count
  const sidebarCount = await page.locator('.popular-item').count();
  console.log('Sidebar top completed items rendered:', sidebarCount);

  // Save screenshot
  const screenshotPath = 'C:\\Users\\imame.AMEEN\\.gemini\antigravity-ide\\brain\\9465c7aa-50b7-40bf-bfca-3ab47b57f706\\browser_live_check.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  if (errors.length > 0) {
    console.log('\nPage Errors:', errors);
  }

  if (failedRequests.length > 0) {
    console.log('\nFailed Requests:', failedRequests.slice(0, 5));
  }

  console.log('\nRelevant Console Logs:');
  consoleLogs.slice(-15).forEach((l) => console.log('  ', l));

  await browser.close();
}

run().catch((err) => {
  console.error('Browser test failed:', err);
  process.exit(1);
});
