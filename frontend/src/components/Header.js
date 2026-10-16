// frontend/src/components/Header.js
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { ThemeContext } from "../context/ThemeContext";
import CelestialToggle from "./Bulb";
import SettingsModal from "./SettingsModal";
import DeveloperInfoModal from "./DeveloperInfoModal";

export default function Header() {
  const logoUrl = new URL("../assets/Skmanganest1.png", import.meta.url).href;
  const location = useLocation();

  const {
    searchQuery,
    setSearchQuery,
    tags,
    selectedTagId,
    selectedTagName,
    selectTag,
    sortOrder,
    setSortOrder,
    resetFilters,
  } = useContext(SearchContext);

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [genreOpen, setGenreOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDevInfoOpen, setIsDevInfoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const genreRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (genreRef.current && !genreRef.current.contains(e.target)) {
        setGenreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter tags in dropdown
  const filteredTags = tags.filter((t) =>
    t.attributes?.name?.en?.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const isReaderPage = location.pathname.startsWith("/manga/");

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={resetFilters} title="SKMangaNest Home">
            <img src={logoUrl} alt="SKMangaNest Logo" className="logo-icon" />
            <span className="logo-text">
              SK<span className="logo-accent">Manga</span>Nest
            </span>
          </Link>

          {/* Hanging Celestial Bulb Toggle on Desktop */}
          <div className="desktop-celestial">
            <CelestialToggle />
          </div>

          {/* Search & Filter Nav Controls */}
          {!isReaderPage && (
            <div className="header-search-wrap">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search thousands of manga, manhwa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery("")}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Controls: Genre & Sort */}
              <div className="header-filter-pills">
                {/* Genre Dropdown */}
                <div className="genre-dropdown-wrap" ref={genreRef}>
                  <button
                    type="button"
                    className={`genre-btn ${selectedTagId ? "has-genre" : ""}`}
                    onClick={() => setGenreOpen((prev) => !prev)}
                  >
                    <span className="genre-icon">🏷️</span>
                    <span className="genre-label">
                      {selectedTagName || "Genres"}
                    </span>
                    <span className="dropdown-arrow">{genreOpen ? "▲" : "▼"}</span>
                  </button>

                  {genreOpen && (
                    <div className="genre-menu">
                      <div className="genre-search-box">
                        <input
                          type="text"
                          placeholder="Filter genres..."
                          value={genreSearch}
                          onChange={(e) => setGenreSearch(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <div className="genre-list">
                        <button
                          type="button"
                          className={`genre-item ${!selectedTagId ? "selected" : ""}`}
                          onClick={() => {
                            selectTag("", "");
                            setGenreOpen(false);
                          }}
                        >
                          All Genres
                        </button>

                        {filteredTags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            className={`genre-item ${tag.id === selectedTagId ? "selected" : ""}`}
                            onClick={() => {
                              selectTag(tag.id, tag.attributes.name.en);
                              setGenreOpen(false);
                            }}
                          >
                            {tag.attributes.name.en}
                          </button>
                        ))}

                        {filteredTags.length === 0 && (
                          <div className="genre-empty">No matching genre</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Order Selector */}
                <div className="sort-selector-wrap">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-select"
                    title="Sort Order"
                  >
                    <option value="latestUploadedChapter.desc">⚡ Latest Updates</option>
                    <option value="followedCount.desc">🔥 Most Popular</option>
                    <option value="rating.desc">⭐ Highest Rated</option>
                    <option value="createdAt.desc">✨ Newly Added</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="header-actions">
            {/* Mobile / Direct Theme Toggle button */}
            <button
              type="button"
              className="action-btn theme-toggle-btn"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              className="action-btn"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
            >
              ⚙️
            </button>

            <button
              type="button"
              className="action-btn dev-btn"
              onClick={() => setIsDevInfoOpen(true)}
              title="Developer Profile"
            >
              👨‍💻
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <DeveloperInfoModal
        isOpen={isDevInfoOpen}
        onClose={() => setIsDevInfoOpen(false)}
      />
    </>
  );
}
