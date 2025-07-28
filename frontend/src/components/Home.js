import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { useManga, useCompletedManga } from "../hooks/useManga";

const MangaList = () => {
  const { searchQuery, selectedTagId, defaultLanguage, showNSFW } =
    useContext(SearchContext);
  const [page, setPage] = useState(1);

  const mangaList = useManga({
    tagId: selectedTagId,
    language: defaultLanguage,
    showNSFW,
    page,
  });
  const completed = useCompletedManga();

  const display = mangaList.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const getCover = (m) =>
    m.coverFilename
      ? `/image-proxy/covers/${m.id}/${m.coverFilename}.256.jpg` // <--- Use proxy URL for img src
      : "/placeholder.jpg";

  return (
    <div className="app">
      <main className="main-content">
        <section className="notifications">
          <div className="notification">📢 New chapters …</div>
          <div className="notification">⏳ Upcoming updates …</div>
          <span className="section-title">Recent Updates</span>
        </section>

        <div className="content-wrapper">
          {!mangaList.length ? (
            <h1>Loading…</h1>
          ) : (
            <>
              <div className="grid">
                <div className="manga-list">
                  {display.map((m) => (
                    <Link
                      key={m.id}
                      className="comic-card"
                      to={`/manga/${m.id}`}
                    >
                      <div className="comic-header center">
                        <img
                          src={getCover(m)}
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

                <div className="pagination">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  <span>Page {page}</span>
                  <button onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              </div>

              <aside className="side">
                <h2 className="section-title">Popular Manga</h2>
                <div className="popular-manga">
                  {completed.map((m) => (
                    <Link key={m.id} to={`/manga/${m.id}`}>
                      <div className="recent-item">
                        <img
                          src={getCover(m)}
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
              </aside>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MangaList;
