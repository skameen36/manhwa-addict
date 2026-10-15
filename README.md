# SKMangaNest — Premium Manga & Manhwa Web App

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Parcel](https://img.shields.io/badge/Bundler-Parcel-important.svg)](https://parceljs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)
[![MangaDex API](https://img.shields.io/badge/API-MangaDex%20v5-orange.svg)](https://api.mangadex.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, responsive, and high-performance single-page React web application for browsing, searching, and reading Manga, Manhwa, and Manhua powered by the official MangaDex API.

---

## 🌟 Key Features

- **⚡ Live Global Search**: Instant debounced search querying the entire MangaDex catalog.
- **🏷️ Genre & Tag Filtering**: Browse by categories (Action, Romance, Fantasy, Comedy, Martial Arts, etc.) with real-time tag search.
- **🔥 Hero Spotlight Carousel**: Dynamic showcase highlighting top featured manga with synopsis, tags, and quick-read link.
- **📜 Webtoon & Single-Page Chapter Reader**:
  - MangaDex@Home distributed node integration for high-definition chapter images.
  - Continuous vertical scroll mode (Webtoon) and classic Single-page reader mode.
  - Interactive Chapter Selector dropdown to instantly jump to any chapter.
  - Reading progress indicator and page retry fallbacks.
- **🌓 Adaptive Theme Engine**: Smooth Dark Mode and Light Mode switching with system preference detection and animated hanging bulb toggle.
- **📱 Fully Responsive**: Flawless experience across mobile smartphones, tablets, laptops, and ultra-wide desktop monitors.
- **🚀 Vercel Production Ready**: Zero-config Vercel Serverless Functions (`/api/mangadex` & `/api/image-proxy`) providing server-side CORS resolution, in-flight request deduplication, and edge caching.
- **👨‍💻 Developer Profile**: Interactive modal showcasing developer credentials, skills, and portfolio.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Context API, StrictMode) |
| **Routing** | React Router v6 (Nested routes, SPA rewrites, ScrollRestoration) |
| **Styling** | Modern CSS Design System (CSS Variables, Glassmorphism, Responsive Grid) |
| **Animations** | Framer Motion (Theme toggle animations, smooth transitions) |
| **Bundler** | Parcel 2 (`--no-cache` production builds) |
| **Serverless Functions** | Vercel Serverless Node.js Functions (`/api/mangadex.js`, `/api/image-proxy.js`) |
| **Data Source** | MangaDex API v5 REST Endpoints |

---

## 🔧 Solving Vercel Deployment & CORS

Browsers enforce Cross-Origin Resource Sharing (CORS) rules that block direct client-side JavaScript requests to `https://api.mangadex.org` from custom domains.

This application includes two dedicated Vercel Serverless Functions in the `/api` directory:

1. **`/api/mangadex`**:
   - Proxies JSON API requests server-to-server.
   - Cleans base URLs and sanitizes endpoint query strings.
   - Sends the mandatory MangaDex User-Agent header.
   - Sets edge cache headers (`Cache-Control: public, s-maxage=300`) to respect API rate limits.
2. **`/api/image-proxy`**:
   - Proxies and caches cover art and chapter images when direct CDN access is restricted.
   - Streams binary image buffers directly with proper Content-Type headers.

---

## 🚀 Deployment to Vercel

Deploying to Vercel takes less than 2 minutes:

### Step 1: Push Repository to GitHub
```bash
git add .
git commit -m "Production-ready upgrade"
git push origin main
```

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/).
2. Click **Add New Project** and select your repository.
3. Vercel automatically detects the project configuration from `vercel.json`:
   - **Build Command**: `parcel build index.html --dist-dir dist --no-cache`
   - **Output Directory**: `dist`
4. *(Optional)* Add Environment Variables in Vercel:
   - `MANGADEX_API`: `https://api.mangadex.org`
   - `MANGADEX_CLIENT_ID`: Your MangaDex client ID (if applicable)
5. Click **Deploy**!

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/skameen36/manhwa-addict.git
cd manhwa-addict
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
> App runs at `http://localhost:1234`

### 4. Run local API proxy (Optional)
To test Vercel serverless functions locally without installing Vercel CLI:
```bash
npm run dev:proxy
```
> Proxy runs at `http://localhost:3000`

### 5. Build for production
```bash
npm run build
```

---

## 👤 Author

**Shaikh Ameen**  
*Software Associate – Frontend Developer*

- 📧 Email: [imameen36@gmail.com](mailto:imameen36@gmail.com)
- 📞 Phone: +91 8625802122
- 🔗 LinkedIn: [ameen-shaikh-972b2b233](https://www.linkedin.com/in/ameen-shaikh-972b2b233)
- 💻 GitHub: [@skameen36](https://github.com/skameen36)
- 📍 Location: Amravati, Maharashtra, India

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
Manga and images are property of their respective creators and scanlation teams via MangaDex.
