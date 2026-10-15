// frontend/src/components/SettingsModal.js
import React, { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import { ThemeContext } from "../context/ThemeContext";

export default function SettingsModal({ isOpen, onClose }) {
  const {
    defaultLanguage,
    setDefaultLanguage,
    showNSFW,
    setShowNSFW,
  } = useContext(SearchContext);

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel settings-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-heading"
      >
        <div className="settings-header">
          <h2 id="settings-heading">Preferences & Settings</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Appearance */}
        <div className="setting-section">
          <h3 className="setting-title">Appearance</h3>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Dark Theme</span>
              <span className="setting-desc">Switch between deep dark mode and crisp light mode</span>
            </div>
            <label className="switch-label">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="switch-slider" />
            </label>
          </div>
        </div>

        {/* Content & Language */}
        <div className="setting-section">
          <h3 className="setting-title">Language & Reading</h3>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Preferred Chapter Language</span>
              <span className="setting-desc">Filter chapters in your preferred translation</span>
            </div>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="select-input"
            >
              <option value="en">English (EN)</option>
              <option value="ko">Korean (KO)</option>
              <option value="ja">Japanese (JA)</option>
              <option value="es">Spanish (ES)</option>
              <option value="fr">French (FR)</option>
              <option value="all">All Available Languages</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Mature Content (NSFW)</span>
              <span className="setting-desc">Include erotica and 18+ titles in catalog</span>
            </div>
            <label className="switch-label">
              <input
                type="checkbox"
                checked={showNSFW}
                onChange={(e) => setShowNSFW(e.target.checked)}
              />
              <span className="switch-slider" />
            </label>
          </div>
        </div>

        {/* System & Architecture Info */}
        <div className="setting-section">
          <h3 className="setting-title">System & API Status</h3>
          <div className="system-status-box">
            <div className="status-indicator-line">
              <span className="status-dot green" />
              <span>Vercel Serverless Function Proxy: <strong>Active</strong></span>
            </div>
            <div className="status-indicator-line">
              <span className="status-dot blue" />
              <span>MangaDex API: <strong>api.mangadex.org</strong></span>
            </div>
            <div className="status-indicator-line">
              <span className="status-dot purple" />
              <span>Edge Caching: <strong>Enabled (5m TTL)</strong></span>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
