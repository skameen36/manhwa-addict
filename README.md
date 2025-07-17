# SKMangaNest

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![React](https://img.shields.io/badge/Library-React-blue.svg)](https://reactjs.org/)  
[![Parcel](https://img.shields.io/badge/Bundler-Parcel-important.svg)](https://parceljs.org/)  
[![MangaDex API](https://img.shields.io/badge/API-MangaDex-orange.svg)](https://api.mangadex.org/)

> A modern, responsive single‑page React app for browsing, searching and reading manga via the MangaDex API.  
> Features live search, category (tag) filtering, light/dark theme toggle, and a polished developer‑info modal.

---

## 📸 Screenshots

| Home (Light)   | Home (Dark)    | Reader         |
| -------------- | -------------- | -------------- |
| ![light][light] | ![dark][dark] | ![reader][reader] |

[light]: <img width="1903" height="911" alt="image" src="https://github.com/user-attachments/assets/cd3b118c-b8a2-49f3-b248-69a386e72e06" />
  
[dark]: <img width="1902" height="907" alt="image" src="https://github.com/user-attachments/assets/5cfa4919-108f-4af1-941c-6c1648b17d10" />
 
[reader]: <img width="1905" height="904" alt="image" src="https://github.com/user-attachments/assets/dd7e0679-a222-4f34-83c6-25edc9823351" />


---

## 🚀 Live Demo

Coming soon! (Deploying to Netlify / Vercel)

---

## ✨ Features

- **Recent Updates**: fetches latest manga (`GET /manga?limit=20&includes[]=cover_art`)  
- **Popular Manga**: shows completed series (`GET /manga?limit=20&includes[]=cover_art&status[]=completed`)  
- **Search**: instant client‑side filtering by title  
- **Categories**: filter by MangaDex tags (`GET /manga/tag?limit=100`)  
- **Theme Toggle**: Light ↔ Dark with sun/moon animation (Framer Motion) and `localStorage` persistence  
- **Developer Info**: modal with contact info and key contributions  
- **Lazy Loading**: chapter images load on‑demand (Intersection Observer)  
- **Client‑side Routing**: React Router v6 for list and chapter pages  
- **API Caching**: in‑memory cache to reduce redundant network calls  

---

## 🛠️ Tech Stack

- **Framework**: React 18  
- **Routing**: React Router v6  
- **Bundler**: Parcel 2  
- **Animation**: Framer Motion  
- **CSS**: Custom properties ( `--bg-color`/`--fg-color` ) + modern flex/grid  
- **State**: React Context (Search & Theme) + Hooks  
- **API**: MangaDex OpenAPI (REST)  

---

## 📦 Installation

1. **Clone**  
   ```bash
   git clone https://github.com/your-username/SKMangaNest.git
   cd SKMangaNest
Install dependencies

bash
Copy
Edit
npm install
# or
yarn install
Environment Variables
Create a .env in the project root:

ini
Copy
Edit
REACT_APP_MANGADEX_CLIENT_ID=your_client_id
REACT_APP_MANGADEX_USERNAME=your_username
REACT_APP_MANGADEX_PASSWORD=your_password
Only needed if you implement the AccessTokens helper for authenticated endpoints.

Start dev server

bash
Copy
Edit
npm start
# opens http://localhost:1234
Build for production

bash
Copy
Edit
npm run build
Outputs to dist/.

🗂️ Project Structure
bash
Copy
Edit
SKMangaNest/
├── .env                  # API credentials (gitignored)
├── index.html            # App entry
├── index.css             # Global styles & CSS variables
├── package.json
├── frontend/
│   └── src/
│       ├── assets/       # Logo, sun/moon images
│       ├── component/    # All React components
│       │   ├── Header.js
│       │   ├── Home.js
│       │   ├── MangaChapter.js
│       │   ├── SettingsModal.js
│       │   ├── DeveloperInfoModal.js
│       │   └── CelestialToggle.js
│       ├── utils/        # Context providers
│       │   ├── SearchContext.js
│       │   └── ThemeContext.js
│       └── App.js        # Router & Context setup
└── LICENSE
📜 Usage
Search by typing in the header search box.

Filter by clicking Categories, then pick a tag.

Toggle theme by clicking the swinging sun/moon icon.

View details via the ⚙️ button (Settings) or 👤 button (Developer Info).

Read chapters: click a cover → use Next/Previous buttons.

📖 How It Works
Data fetching is centralized via a fetchWithCache wrapper:

Caches JSON responses in a Map to avoid duplicate requests.

Supports dynamic URL construction (tags, status).

SearchContext provides:

searchQuery, setSearchQuery

tags, selectedTagId, setSelectedTagId

ThemeContext

Manages darkMode state, writes to localStorage

Adds/removes the .dark class on <html> to switch CSS variables

CSS Variables

css
Copy
Edit
:root { --bg-color: #f5f5f5; --fg-color: #1e1e2e; }
html.dark { --bg-color: #12121b; --fg-color: #e0e0e0; }
body { background: var(--bg-color); color: var(--fg-color); }
Chapter Reader

Fetches chapter list via GET /manga/{id}/feed

Loads pages from GET /at-home/server/{chapterId}

Lazy‑loads images with react-intersection-observer

🛣️ Roadmap
✅ Basic browsing & filtering

✅ Theme toggle & persistence

✅ Developer Info modal

⚙️ User authentication & “My List”

🔖 Bookmark & resume reading

🔁 Infinite scroll & pagination

🧪 Unit & integration tests

💬 Contributing
Fork it

Create a feature branch (git checkout -b feature/name)

Commit your changes (git commit -m "feat: add …")

Push to branch (git push origin feature/name)

Open a Pull Request

Please follow the Contributor Covenant.

📄 License
This project is licensed under the MIT License. See LICENSE for details.

🙋‍♂️ Author
Shaikh Ameen

✉️ imameen36@gmail.com

🔗 LinkedIn • GitHub

📍 Amravati, Maharashtra, India

pgsql
Copy
Edit

> #### Why mention MangaDex API?
> We rely on MangaDex’s public REST endpoints for all manga metadata, covers, tags and chapter data.  
> This makes SKMangaNest a lightweight frontend that can be adapted to any manga‑hosting backend.

Feel free to edit paths, badges, or screenshots to match your repo’s assets and final URLs!
::contentReference[oaicite:0]{index=0}
