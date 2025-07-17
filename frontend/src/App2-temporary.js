import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Pagination from "./component/Pagination.js";
import { imgurl, timeAgo } from "./config.js";
import useFetchRecent from "./utils/useRecentDataCall.js";
import { recentApiurl, popularApiurl } from "./config.js";
import Header from "./component/Header.js";
import getAccessToken from "./component/AccessTokens.js";

const App = () => {

  // const clientId = process.env.REACT_APP_MANGADEX_CLIENT_ID;
  // const clientSecret = process.env.REACT_APP_MANGADEX_CLIENT_SECRET;
  // const psd =  process.env.REACT_APP_MANGADEX_PASSWORD
  // console.log(clientId, clientSecret, psd);


  const { data: recentData, loading: recentLoading, error: recentError } = useFetchRecent(recentApiurl);
  const { data: popularData, loading: popularLoading, error: popularError } = useFetchRecent(popularApiurl);
  const { data: newdata, loading: newloadg, error: newerror } = useFetchRecent("https://api.comick.io/comic/LpYZro4z/chapters");
  console.log("recentApiurl App.js", recentData);
  console.log("popularApiurl App.js", popularData?.rank);
  console.log("newdata App.js", newdata);

  const [recentUpadtes, setRecentUpdates] = useState([]);
  const [popularUpdates, setPopularUpdates] = useState([]);
  const [newUpdates, setNewUpdates] = useState([]);

  useEffect(() => {
    setRecentUpdates(recentData);
    setPopularUpdates(popularData?.rank || []);
    setNewUpdates(newdata);

  }, [recentData, popularData]);


  const PAGE_SIZE = 12;
  const totalItems = recentUpadtes.length;
  const noOfPages = Math.ceil(totalItems / PAGE_SIZE);
  console.log("noofPages", noOfPages);

  const [currentPage, setCurrentPage] = useState(0);
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  if (recentError) {
    return <h1>Error: {error}</h1>
  }

  if (recentLoading) {
    return <>
      <h1>Loading...</h1>;
    </>
  }

  return (
    <div className="app">
      {/* Header */}
      <Header />
      {/* <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" /> <HangingBulb  />
          SKMangaNest
        </div>
        <nav className="nav">
          <input type="text" className="search-bar" placeholder="Search comics..." />
          <button className="btn">Categories</button>
          <div className="user-options">
            <button className="btn">My List</button>
            <button className="btn">⚙️</button>
            <button className="btn">👤</button>
          </div>
        </nav>
      </header> */}

      {/* Main Content */}
      <main className="main-content">
        {/* Notifications */}
        <section className="notifications">
          <div className="notification">
            📢 Some new chapters were delayed to support the translator group.
          </div>
          <div className="notification">
            🌍 Click here to show English comics only.
          </div>
        </section >

        <div className="content-wrapper">
          <section className="following">
            <h2 className="section-title">Recent Updates</h2>
            <div className="grid">
              {recentUpadtes.slice(start, end).map((items, i) => (
                <div key={items.id} className="comic-card">
                  <div className="comic-header center">
                    <img
                      src={imgurl + items.md_comics?.md_covers[0]?.b2key}
                      alt={items.md_comics.title}
                      className="comic-thumbnail"
                    />
                  </div>
                  <div className="comic-details">
                    <span className="likes">💖{items.up_count}</span>
                    <span>{timeAgo(items.publish_at)}</span>
                    <h3>{items.md_comics.title.length > 30
                      ? items.md_comics.title.substring(0, 30) + "..."
                      : items.md_comics.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            <Pagination currentPage={currentPage} noOfPages={noOfPages} setCurrentPage={setCurrentPage}></Pagination>

          </section>


          {/* Sidebar */}
          {!popularUpdates.length ? (<h1> loading....</h1>) : (<aside className="sidebar">
            <h3 className="section-title">Populer / Complete Series</h3>
            <ul className="recent-list">
              {popularUpdates.map((data, i) => (
                <li key={i} className="recent-item">
                  <span className="ranking-index">{i + 1}</span>
                  <span className="title">{data.title}</span>
                  <img src={imgurl + data?.md_covers[0]?.b2key} alt="" />
                </li>
              ))}
            </ul>
          </aside>)}
        </div>
      </main>
    </div>
  )
}

// ReactDom.render(<App />, document.getElementById("root")); //React17 or below not supported new features automatic batching, concurrent rendering, server-side streaming.

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);