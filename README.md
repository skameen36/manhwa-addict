# SKMangaNest

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![React](https://img.shields.io/badge/Library-React-blue.svg)](https://reactjs.org/)  
[![Parcel](https://img.shields.io/badge/Bundler-Parcel-important.svg)](https://parceljs.org/)  
[![MangaDex API](https://img.shields.io/badge/API-MangaDex-orange.svg)](https://api.mangadex.org/)

> A modern, responsive single‑page React app for browsing, searching and reading manga via the MangaDex API.  
> Features live search, category (tag) filtering, light/dark theme toggle, and a polished developer‑info modal.


---

## 📸 Screenshots

<p align="center">
  <!-- Replace with actual screenshot links when available -->
  <img src="https://placehold.co/400x250/E0E0E0/333333?text=Light+Mode" alt="Light Mode Screenshot" style="margin: 10px; border-radius: 8px;" />
  <img src="https://placehold.co/400x250/333333/E0E0E0?text=Dark+Mode" alt="Dark Mode Screenshot" style="margin: 10px; border-radius: 8px;" />
  <img src="https://placehold.co/400x250/A0A0A0/FFFFFF?text=Chapter+Reader" alt="Chapter Reader Screenshot" style="margin: 10px; border-radius: 8px;" />
</p>

---

## 🚀 Live Demo

🌐 [Live Demo on Netlify / Vercel — Coming Soon]

---

## ✨ Features

* Recent Manga Updates
* Popular Completed Manga
* Instant Search & Client-side Filtering
* Category (Tag) Filtering
* Dark/Light Theme with Framer Motion
* Chapter Reader with Lazy Image Loading
* Responsive Layout & Clean UI
* Developer Info Modal
* API Caching for Optimized Performance
* Pagination Support

---

## 🛠️ Tech Stack

| Tech             | Usage               |
| :--------------- | :------------------ |
| React 18         | Frontend Framework  |
| Parcel 2         | Bundler             |
| React Router v6  | Routing             |
| Framer Motion    | Theme Toggle Animations |
| Tailwind CSS     | Styling + Custom Variables |
| Context API      | State Management    |
| MangaDex API     | Data Source (REST API) |

---

## 🧑‍💻 Installation

```bash
git clone [https://github.com/your-username/SKMangaNest.git](https://github.com/your-username/SKMangaNest.git)
cd SKMangaNest
npm install
npm start

Opens at: http://localhost:1234

⚙️ Environment Variables (Optional)
Only needed if you use login-based endpoints in the future:

Code snippet

REACT_APP_MANGADEX_CLIENT_ID=your_client_id
REACT_APP_MANGADEX_USERNAME=your_username
REACT_APP_MANGADEX_PASSWORD=your_password


🗂️ Project Structure
MANHWA-ADDICT/
├── .parcel-cache/
├── backend/                   # Placeholder for future backend logic
├── dist/                      # Parcel build output
├── frontend/
│   └── src/
│       ├── assets/            # Static assets (icons, logos, etc.)
│       ├── components/        # All UI components
│       │   ├── AccessTokens.js
│       │   ├── Bulb.js
│       │   ├── DeveloperInfoModal.js
│       │   ├── Header.js
│       │   ├── Home.js
│       │   ├── MangaChapter.js
│       │   ├── Pagination.js
│       │   └── SettingsModal.js
│       ├── context/           # Context API for global state
│       │   ├── SearchContext.js
│       │   └── ThemeContext.js
│       ├── hooks/             # Custom React hooks
│       │   └── useManga.js
│       ├── pages/             # Reserved for routed views (if added later)
│       ├── utils/             # Helper functions and configs
│       │   ├── App.js
│       │   └── config.js
├── node_modules/
├── .env
├── .gitignore
├── index.css
├── index.html
├── package.json
├── package-lock.json
└── README.md

🧠 How It Works
Data Fetching:

Uses fetchWithCache to avoid redundant API requests.

ThemeContext:

Stores light/dark preference and syncs with localStorage.

SearchContext:

Stores search query and selected tag globally.

Chapter Reader:

Fetches chapter images using GET /at-home/server/{chapterId}

Implements lazy loading with Intersection Observer.

🛣️ Roadmap
✅ Completed Manga & Recent Updates

✅ Chapter Reading & Image Lazy Load

✅ Tag Filtering & Search

✅ Theme Switcher

✅ Pagination Support

⏳ Bookmark/Resume Reading

⏳ User Auth for My List (Optional)

⏳ Deploy to Vercel / Netlify

📄 License
This project is licensed under the MIT License — see the LICENSE file.

🙋 Author
Shaikh Ameen

📧 imameen36@gmail.com

🌐 LinkedIn | GitHub

📍 Amravati, Maharashtra, India

🔗 Why MangaDex API?
We use the MangaDex open REST API to fetch all manga-related data, including covers, tags, chapters, and images — making this a pure frontend app with no server-side dependencies.
