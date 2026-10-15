// frontend/src/components/Error.js
import React from "react";
import { useRouteError, Link } from "react-router-dom";

export default function Error() {
  const err = useRouteError();

  return (
    <div className="error-page-container">
      <div className="error-page-card">
        <div className="error-emoji">🧭</div>
        <h1 className="error-code">{err?.status || "Oops!"}</h1>
        <h2 className="error-title">Page Not Found or Something Went Wrong</h2>
        <p className="error-description">
          {err?.statusText || err?.message || "The page you are looking for might have been moved or does not exist."}
        </p>
        <Link to="/" className="btn-primary error-home-btn">
          ‹ Back to Manga Library
        </Link>
      </div>
    </div>
  );
}