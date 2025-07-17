import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import MangaList from "./component/Home";
import MangaChapters from "./component/MangaChapter";
import Header from "./component/Header";
import { SearchProvider } from "./utils/SearchContext";
import {ThemeProvider} from "./utils/ThemeContext";

const App = () => {
  return (
    <div className="app-main">
      <Header />
      <Outlet />
    </div>
  );
};

const appRoutes = createBrowserRouter([
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
      <SearchProvider>
        <RouterProvider router={appRoutes} />
      </SearchProvider>
  </ThemeProvider>
);

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<MangaList />} />
//         <Route path="/manga/:mangaId" element={<MangaChapters />} />
//       </Routes>
//     </Router>
//   );
// };

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);

// export default App;
