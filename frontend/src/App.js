import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import MangaList from "./components/Home";
import MangaChapters from "./components/MangaChapter";
import Header from "./components/Header";
import Error from "./components/Error";
import { SearchProvider } from "./context/SearchContext";
import {ThemeProvider} from "./context/ThemeContext";
import { StrictMode } from "react";

const App = () => {
  return (
    <div className="app-main">
      <Header />
      <Outlet />
    </div>
  );
};

const appRoutes = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <MangaList />,
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
    }
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

