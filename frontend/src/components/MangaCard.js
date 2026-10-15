// frontend/src/components/MangaCard.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getMangaCoverUrl, getProxyImageUrl } from "../utils/api";

const PLACEHOLDER_SVG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='360' viewBox='0 0 256 360'%3E%3Crect width='256' height='360' fill='%231e1e2e'/%3E%3Ctext x='50%25' y='50%25' fill='%238888aa' font-family='sans-serif' font-size='16' text-anchor='middle' dy='.3em'%3ENo Cover%3C/text%3E%3C/svg%3E";

export default function MangaCard({ manga }) {
  const [imgSrc, setImgSrc] = useState(() => {
    return getMangaCoverUrl(manga.id, manga.coverFilename, "256") || PLACEHOLDER_SVG;
  });
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleImageError = () => {
    if (!hasError && manga.coverFilename) {
      setHasError(true);
      // Fallback: try proxying through serverless function
      const direct = getMangaCoverUrl(manga.id, manga.coverFilename, "256");
      setImgSrc(getProxyImageUrl(direct));
    } else {
      setImgSrc(PLACEHOLDER_SVG);
    }
  };

  const statusClass = manga.status === "completed" ? "badge-completed" : "badge-ongoing";

  return (
    <Link to={`/manga/${manga.id}`} className="manga-card" title={manga.title}>
      <div className="manga-card-poster">
        {!loaded && <div className="poster-skeleton shimmer" />}
        <img
          src={imgSrc}
          alt={manga.title}
          className={`poster-img ${loaded ? "loaded" : "loading"}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={handleImageError}
        />
        <div className="poster-overlay" />
        
        {manga.status && (
          <span className={`status-badge ${statusClass}`}>
            {manga.status.toUpperCase()}
          </span>
        )}

        {manga.year && (
          <span className="year-badge">
            {manga.year}
          </span>
        )}
      </div>

      <div className="manga-card-info">
        <h3 className="manga-card-title">{manga.title}</h3>
        
        {manga.tags && manga.tags.length > 0 && (
          <div className="manga-card-tags">
            {manga.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        {manga.authorName && (
          <p className="manga-card-author">
            By {manga.authorName}
          </p>
        )}
      </div>
    </Link>
  );
}
