// frontend/src/components/Pagination.js
import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  // Generate intelligent page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelect = (p) => {
    if (typeof p === "number" && p !== currentPage) {
      onPageChange(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="pagination-container" aria-label="Pagination">
      <button
        type="button"
        className="pagination-btn pagination-arrow"
        onClick={handlePrev}
        disabled={currentPage <= 1}
        title="Previous Page"
      >
        ‹ Prev
      </button>

      <div className="pagination-numbers">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`pagination-number ${p === currentPage ? "active" : ""}`}
              onClick={() => handleSelect(p)}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="pagination-btn pagination-arrow"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        title="Next Page"
      >
        Next ›
      </button>
    </nav>
  );
}