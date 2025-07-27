import logo from "../assets/Skmanganest1.png";
import CelestialToggle from "./Bulb";
import { useContext, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import { Link } from "react-router-dom";
import SettingsModal from "./SettingsModal";
import DeveloperInfoModal from "./DeveloperInfoModal";

const Header = () => {

  const { searchQuery, setSearchQuery, tags, selectedTagId, setSelectedTagId } =
    useContext(SearchContext);

  const [open, setOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false);

  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId);
    setOpen(false);
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo-link">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-img" />
            SKMangaNest
          </div>
        </Link>
        <CelestialToggle />

        <nav className="nav">
          <input
            type="text"
            className="search-bar"
            placeholder="Search comics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="categories-wrapper ">
            <button className="btn" onClick={() => setOpen((o) => !o)}>
              {selectedTagId
                ? tags.find((t) => t.id === selectedTagId)?.attributes.name.en
                : "Genre"}
            </button>

            {open && (
              <div className="categories-dropdown">
                <div
                  className={`category-item ${
                    !selectedTagId ? "selected" : ""
                  }`}
                  onClick={() => handleTagClick("")}
                >
                  All Categories
                </div>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className={
                      "category-item" +
                      (tag.id === selectedTagId ? " selected" : "")
                    }
                    onClick={() => handleTagClick(tag.id)}
                  >
                    {tag.attributes.name.en}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="user-options">
            <button className="btn" onClick={() => setIsSettingsOpen(true)}>
              ⚙️
            </button>
            <button
              className="btn"
              onClick={() => setIsDeveloperInfoOpen(true)}
            >
              🔗
            </button>
          </div>
        </nav>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <DeveloperInfoModal
        isOpen={isDeveloperInfoOpen}
        onClose={() => setIsDeveloperInfoOpen(false)}
      />
    </>
  );
};

export default Header;
