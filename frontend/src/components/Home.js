// frontend/src/components/Home.js
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { useManga, usePopularManga, useFeaturedManga } from "../hooks/useManga";
import MangaCard from "./MangaCard";
import Pagination from "./Pagination";
import { getMangaCoverUrl, getProxyImageUrl } from "../utils/api";

const PLACEHOLDER_SVG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='360' viewBox='0 0 256 360'%3E%3Crect width='256' height='360' fill='%23111827'/%3E%3Ctext x='50%25' y='50%25' fill='%238888aa' font-family='sans-serif' font-size='16' text-anchor='middle' dy='.3em'%3ENo Cover%3C/text%3E%3C/svg%3E";

function HeroPoster({ manga }) {
  const [src, setSrc] = useState(() => {
    return getMangaCoverUrl(manga.id, manga.coverFilename, "512") || PLACEHOLDER_SVG;
  });
  const [triedProxy, setTriedProxy] = useState(false);

  useEffect(() => {
    setSrc(getMangaCoverUrl(manga.id, manga.coverFilename, "512") || PLACEHOLDER_SVG);
    setTriedProxy(false);
  }, [manga.id, manga.coverFilename]);

  const handleError = () => {
    if (!triedProxy && manga.coverFilename) {
      setTriedProxy(true);
      const direct = getMangaCoverUrl(manga.id, manga.coverFilename, "256");
      setSrc(getProxyImageUrl(direct));
    } else {
      setSrc(PLACEHOLDER_SVG);
    }
  };

  return (
    <img
      src={src}
      alt={manga.title}
      className="hero-poster"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

function SidebarThumb({ manga }) {
  const [src, setSrc] = useState(() => {
    return getMangaCoverUrl(manga.id, manga.coverFilename, "256") || PLACEHOLDER_SVG;
  });
  const [triedProxy, setTriedProxy] = useState(false);

  useEffect(() => {
    setSrc(getMangaCoverUrl(manga.id, manga.coverFilename, "256") || PLACEHOLDER_SVG);
    setTriedProxy(false);
  }, [manga.id, manga.coverFilename]);

  const handleError = () => {
    if (!triedProxy && manga.coverFilename) {
      setTriedProxy(true);
      const direct = getMangaCoverUrl(manga.id, manga.coverFilename, "256");
      setSrc(getProxyImageUrl(direct));
    } else {
      setSrc(PLACEHOLDER_SVG);
    }
  };

  return (
    <img
      src={src}
      alt={manga.title}
      className="popular-thumb"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

export default function Home() {
  const {
    debouncedQuery,
    selectedTagId,
    selectedTagName,
    selectTag,
    defaultLanguage,
    showNSFW,
    sortOrder,
    statusFilter,
    setStatusFilter,
    resetFilters,
  } = useContext(SearchContext);

  const [page, setPage] = useState(1);

  // Reset to page 1 whenever search, genre, sort, or status filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedTagId, sortOrder, statusFilter, defaultLanguage, showNSFW]);

  const { manga, loading, error, totalPages, total, refetch } = useManga({
    searchQuery: debouncedQuery,
    tagId: selectedTagId,
    language: defaultLanguage,
    showNSFW,
    sortOrder,
    statusFilter,
    page,
  });

  const { popular, loading: popularLoading } = usePopularManga();
  const { featured, loading: featuredLoading } = useFeaturedManga();

  // Pick top featured item for hero banner
  const heroItem = featured && featured.length > 0 ? featured[0] : null;

  return (
    <div className="home-container">
      {/* Hero Spotlight Banner (Visible when no active search) */}
      {!debouncedQuery && heroItem && (
        <section className="hero-banner">
          <div className="hero-backdrop" />
          <div className="hero-content">
            <div className="hero-badge">⭐ SPOTLIGHT MANGA</div>
            <h1 className="hero-title">{heroItem.title}</h1>
            <p className="hero-desc">
              {heroItem.description
                ? heroItem.description.slice(0, 180) + "…"
                : "Immerse yourself in top-rated manga and manhwa adventures with high-definition chapters."}
            </p>
            {heroItem.tags && heroItem.tags.length > 0 && (
              <div className="hero-tags">
                {heroItem.tags.map((tag, idx) => (
                  <span key={idx} className="hero-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="hero-actions">
              <Link to={`/manga/${heroItem.id}`} className="hero-btn-primary">
                📖 Start Reading
              </Link>
            </div>
          </div>
          {heroItem.coverFilename && (
            <div className="hero-poster-wrap">
              <HeroPoster manga={heroItem} />
            </div>
          )}
        </section>
      )}

      {/* Main Content Layout with Grid and Sidebar */}
      <div className="home-layout">
        <main className="catalog-main">
          {/* Active Filter Chips and Status Tabs */}
          <div className="catalog-header">
            <div className="filter-tabs">
              <button
                type="button"
                className={`filter-tab ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All Status
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === "ongoing" ? "active" : ""}`}
                onClick={() => setStatusFilter("ongoing")}
              >
                Ongoing
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === "completed" ? "active" : ""}`}
                onClick={() => setStatusFilter("completed")}
              >
                Completed
              </button>
            </div>

            {/* Total Results Count */}
            {!loading && total > 0 && (
              <span className="results-count">
                {total.toLocaleString()} titles found
              </span>
            )}
          </div>

          {/* Active Filter Badges */}
          {(debouncedQuery || selectedTagId) && (
            <div className="active-filters-bar">
              <span className="active-label">Active filters:</span>
              {debouncedQuery && (
                <span className="active-chip">
                  Search: "{debouncedQuery}"
                </span>
              )}
              {selectedTagName && (
                <span className="active-chip">
                  Genre: {selectedTagName}
                  <button
                    type="button"
                    onClick={() => selectTag("", "")}
                    className="chip-remove"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="clear-all-link"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="manga-grid">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="skeleton-card">
                  <div className="skeleton-poster shimmer" />
                  <div className="skeleton-line shimmer" />
                  <div className="skeleton-subline shimmer" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="error-state-card">
              <div className="error-icon">⚠️</div>
              <h3>Unable to load manga catalog</h3>
              <p>{error}</p>
              <button type="button" className="retry-btn" onClick={refetch}>
                🔄 Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && manga.length === 0 && (
            <div className="empty-state-card">
              <div className="empty-icon">🔍</div>
              <h3>No manga found</h3>
              <p>
                We couldn't find any titles matching your search criteria. Try
                broadening your keywords or removing filters.
              </p>
              <button
                type="button"
                className="reset-btn"
                onClick={resetFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Manga Grid */}
          {!loading && !error && manga.length > 0 && (
            <>
              <div className="manga-grid">
                {manga.map((item) => (
                  <MangaCard key={item.id} manga={item} />
                ))}
              </div>

              {/* Responsive Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </main>

        {/* Sidebar: Popular Completed Manga */}
        <aside className="catalog-sidebar">
          <div className="sidebar-card">
            <h2 className="sidebar-title">
              <span className="sidebar-title-icon">🔥</span> Top Completed
            </h2>

            {popularLoading && (
              <div className="sidebar-loading">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="sidebar-skeleton-item shimmer" />
                ))}
              </div>
            )}

            {!popularLoading && (
              <div className="popular-list">
                {popular.map((item, index) => (
                  <Link
                    key={item.id}
                    to={`/manga/${item.id}`}
                    className="popular-item"
                  >
                    <span className={`rank-badge ${index < 3 ? `top-${index + 1}` : ""}`}>
                      #{index + 1}
                    </span>
                    <SidebarThumb manga={item} />
                    <div className="popular-meta">
                      <h4 className="popular-title">{item.title}</h4>
                      {item.tags && item.tags.length > 0 && (
                        <span className="popular-tag">{item.tags[0]}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
