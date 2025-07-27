import  { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { ThemeContext } from "../context/ThemeContext";


export default function SettingsModal({ isOpen, onClose }) {

  const { defaultLanguage, setDefaultLanguage, showNSFW, setShowNSFW } =
    useContext(SearchContext);

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        {/* Appearance Section */}
        <div className="setting-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>
              Dark Mode
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
            </label>
          </div>
        </div>

        {/* Content Filters */}
        <div className="setting-section">
          <h3>Content Filters</h3>
          <div className="setting-item">
            <label>
              Default Language
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
              >
                <option value="all">All</option>
                <option value="en">English</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </label>
          </div>
          <div className="setting-item">
            <label>
              Show NSFW Content
              <input
                type="checkbox"
                checked={showNSFW}
                onChange={(e) => setShowNSFW(e.target.checked)}
              />
            </label>
          </div>
        </div>

        {/* Developer Info */}
        <div className="setting-section">
          <h3>Developer Info</h3>
          <p>
            <strong>Author:</strong> Shaikh Ameen
          </p>
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
        </div>

        <button className="btn close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
