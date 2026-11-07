// frontend/src/components/DeveloperInfoModal.js
import React, { useEffect } from "react";

const TECH_STACK = [
  "React (18/19)",
  "JavaScript (ES6+)",
  "Tailwind CSS",
  "GSAP Motion",
  "Redux Toolkit",
  "REST & Serverless",
  "Playwright Testing",
  "Vercel Deployment",
  "Supabase",
];

export default function DeveloperInfoModal({ isOpen, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

        {/* Header: Name, Tagline & Location */}
        <div className="devinfo-header">
          <div className="devinfo-avatar">SA</div>
          <div>
            <h2 id="devinfo-title" className="devinfo-name">
              Shaikh Ameen
            </h2>
            <p className="devinfo-title-text">
              Frontend Engineer &amp; Creative UI Builder
            </p>
            <span className="devinfo-badge">📍 Amravati, Maharashtra, India</span>
          </div>
        </div>

        {/* Contact Links: Phone is blurred & non-callable */}
        <div className="devinfo-links">
          <a
            href="mailto:imameen36@gmail.com"
            className="devinfo-link-chip"
            target="_blank"
            rel="noopener noreferrer"
          >
            📧 imameen36@gmail.com
          </a>

          <div
            className="devinfo-link-chip devinfo-phone-chip"
            title="Direct phone calls are unavailable. Please connect via Email or LinkedIn."
          >
            <span>📞</span>
            <span className="devinfo-phone-blurred" aria-label="Phone number hidden for privacy">
              +91 8625802122
            </span>
            <span className="devinfo-phone-tag">No calls</span>
          </div>

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
            💻 GitHub Profile
          </a>
        </div>

        <div className="devinfo-body">
          {/* Bio Section */}
          <div className="devinfo-bio-card">
            <p className="devinfo-bio-text">
              I build fast, interactive web applications focused on slick UI
              transitions, clean component architecture, and solid network
              performance. From complex enterprise portals and KPI dashboards
              to data-heavy media readers handling tens of thousands of items,
              I turn complex requirements into fluid, accessible user experiences.
            </p>
          </div>

          {/* Tech Stack & Core Competencies */}
          <h3 className="section-label">Tech Stack &amp; Core Competencies</h3>
          <div className="skills-cloud">
            {TECH_STACK.map((tech) => (
              <span key={tech} className="skill-pill">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Current Status (Role & Education) */}
        <div className="devinfo-footer">
          <div className="devinfo-footer-status">
            <div className="devinfo-status-line">
              <span>💼</span>
              <span>
                <strong>Role:</strong> Software Associate – Frontend Developer
              </span>
            </div>
            <div className="devinfo-status-line">
              <span>🎓</span>
              <span>
                <strong>Education:</strong> Master of Computer Applications (MCA)
              </span>
            </div>
          </div>
          <button type="button" className="btn-close-accent" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
