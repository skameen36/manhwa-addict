// frontend/src/components/DeveloperInfoModal.js
import React from "react";

export default function DeveloperInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel devinfo-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="devinfo-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="devinfo-header">
          <div className="devinfo-avatar">SA</div>
          <div>
            <h2 id="devinfo-title" className="devinfo-name">
              Shaikh Ameen
            </h2>
            <p className="devinfo-title-text">
              Software Associate – Frontend Developer
            </p>
            <span className="devinfo-badge">📍 Amravati, Maharashtra</span>
          </div>
        </div>

        <div className="devinfo-links">
          <a
            href="mailto:imameen36@gmail.com"
            className="devinfo-link-chip"
            target="_blank"
            rel="noopener noreferrer"
          >
            📧 imameen36@gmail.com
          </a>
          <a href="tel:+918625802122" className="devinfo-link-chip">
            📞 +91 8625802122
          </a>
          <a
            href="https://www.linkedin.com/in/ameen-shaikh-972b2b233"
            target="_blank"
            rel="noopener noreferrer"
            className="devinfo-link-chip"
          >
            🔗 LinkedIn Profile
          </a>
          <a
            href="https://github.com/skameen36"
            target="_blank"
            rel="noopener noreferrer"
            className="devinfo-link-chip"
          >
            💻 GitHub / skameen36
          </a>
        </div>

        <div className="devinfo-body">
          <h3 className="section-label">Core Competencies</h3>
          <div className="skills-cloud">
            <span className="skill-pill">React 18</span>
            <span className="skill-pill">JavaScript (ES6+)</span>
            <span className="skill-pill">REST APIs & Serverless</span>
            <span className="skill-pill">State Management</span>
            <span className="skill-pill">Responsive Design</span>
            <span className="skill-pill">Parcel & Webpack</span>
            <span className="skill-pill">Tailwind CSS / Vanilla CSS</span>
            <span className="skill-pill">Git & Vercel CI/CD</span>
          </div>

          <h3 className="section-label">Key Highlights</h3>
          <ul className="devinfo-list">
            <li>Architected production-ready single-page application with React Router v6 and Context API.</li>
            <li>Designed high-performance serverless proxies on Vercel to overcome cross-origin CORS limitations.</li>
            <li>Optimized asset loading with lazy loading, in-flight deduplication, and intelligent TTL caching.</li>
            <li>Crafted sleek responsive design with smooth animations and dark/light mode themes.</li>
          </ul>
        </div>

        <div className="devinfo-footer">
          <span>
            <strong>Experience:</strong> 2+ Years Professional Frontend
          </span>
          <button type="button" className="btn-close-accent" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
