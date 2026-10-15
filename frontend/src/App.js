// frontend/src/App.js
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, Link } from "react-router-dom";
import Home from "./components/Home";
import MangaChapters from "./components/MangaChapter";
import Header from "./components/Header";
import Error from "./components/Error";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">
            SK<span className="logo-accent">Manga</span>Nest
          </span>
          <p className="footer-tagline">
            Your high-speed portal for reading popular Manga, Manhwa, and Manhua online.
          </p>
        </div>

        <div className="footer-meta">
          <p className="footer-attribution">
            Powered by the open <a href="https://mangadex.org" target="_blank" rel="noopener noreferrer">MangaDex API</a>.
          </p>
          <p className="footer-author">
            Crafted with ❤️ by <a href="https://github.com/skameen36" target="_blank" rel="noopener noreferrer">Shaikh Ameen</a>
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} SKMangaNest. All content belongs to respective copyright owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

const AppLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-content-body">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const appRoutes = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/manga/:mangaId",
          element: <MangaChapters />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ThemeProvider>
      <SearchProvider>
        <RouterProvider router={appRoutes} />
      </SearchProvider>
    </ThemeProvider>
  </StrictMode>
);
