import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../utils/SearchContext";

const cache = new Map();

const MangaList = () => {
  const [mangaList, setMangaList] = useState([]);
  const [completedManga, setCompletedManga] = useState([]);

  const { searchQuery, selectedTagId, defaultLanguage, showNSFW } =
    useContext(SearchContext);

  // refetch when tag or language changes
  useEffect(() => {
    fetchManga(selectedTagId);
  }, [selectedTagId, defaultLanguage, showNSFW]);

  useEffect(() => {
    fetchCompleteManga();
  }, []);

  const fetchWithCache = async (url) => {
    if (cache.has(url)) return cache.get(url);
    const res = await fetch(url);
    const json = await res.json();
    cache.set(url, json);
    return json;
  };

  const mapData = (data) =>
    data.map((m) => {
      const coverArt = m.relationships.find((r) => r.type === "cover_art");
      return {
        id: m.id,
        title: m.attributes.title?.en || "No Title",
        coverFilename: coverArt?.attributes?.fileName,
        contentRating: m.attributes.contentRating,
        availableLangs: m.attributes.availableTranslatedLanguages || [],
      };
    });

  const fetchManga = async (tagId = "") => {
    let url = "https://api.mangadex.org/manga?limit=20&includes[]=cover_art";
    if (tagId) url += `&includedTags[]=${tagId}`;

    try {
      const { data } = await fetchWithCache(url);
      let list = mapData(data);

      // filter by defaultLanguage
      if (defaultLanguage !== "all") {
        list = list.filter((m) => m.availableLangs.includes(defaultLanguage));
      }
      // filter NSFW if needed
      if (!showNSFW) {
        list = list.filter((m) => m.contentRating !== "erotica");
      }

      setMangaList(list);
    } catch (e) {
      console.error("Error fetching manga:", e);
    }
  };

  const fetchCompleteManga = async () => {
    try {
      const { data } = await fetchWithCache(
        "https://api.mangadex.org/manga?limit=20&includes[]=cover_art&status[]=completed"
      );
      setCompletedManga(mapData(data));
    } catch (e) {
      console.error("Error fetching popular manga:", e);
    }
  };

  // final filter: search bar
  const displayList = mangaList.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCoverUrl = (m) =>
    m.coverFilename
      ? `https://uploads.mangadex.org/covers/${m.id}/${m.coverFilename}.256.jpg`
      : "/placeholder.jpg";

  return (
    <div className="app">
      <main className="main-content">
        <section className="notifications">
          <div className="notification">
            📢 New chapters may take a moment to appear
          </div>
          <div className="notification">
            ⏳ Upcoming updates may take a little longer than usual due to
            quality checks
          </div>
        </section>

        <div className="content-wrapper">
          {!mangaList.length ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <div className="grid">
                <span className="section-title">Recent Updates</span>
                {displayList.map((m) => (
                  <Link className="comic-card" key={m.id} to={`/manga/${m.id}`}>
                    <div className="comic-header center">
                      <img
                        src={getCoverUrl(m)}
                        alt={m.title}
                        className="comic-thumbnail"
                      />
                    </div>
                    <div className="comic-details">
                      <h3>
                        {m.title.length > 30
                          ? `${m.title.slice(0, 30)}…`
                          : m.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="side">
                <h2 className="section-title">Popular Manga</h2>
                <div className="popular-manga">
                  {completedManga.map((m) => (
                    <Link key={m.id} to={`/manga/${m.id}`}>
                      <div className="recent-item">
                        <img
                          src={getCoverUrl(m)}
                          alt={m.title}
                          className="recent-thumbnail"
                        />
                        <div className="recent-item-details">
                          <h3>{m.title}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MangaList;
