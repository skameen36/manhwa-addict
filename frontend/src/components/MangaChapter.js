// frontend/src/components/MangaChapter.js
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchWithCache, getChapterPageUrl, getProxyImageUrl } from "../utils/api";
import { SearchContext } from "../context/SearchContext";
import { useMangaDetails } from "../hooks/useManga";

export default function MangaChapters() {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const { defaultLanguage } = useContext(SearchContext);

  const { details } = useMangaDetails(mangaId);

  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [pages, setPages] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingPages, setLoadingPages] = useState(false);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingMode, setReadingMode] = useState("continuous"); // 'continuous' or 'single'
  const [singlePageIndex, setSinglePageIndex] = useState(0);

  // Track window scroll progress for reader
  useEffect(() => {
    function handleScroll() {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const current = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch all chapters for this manga
  useEffect(() => {
    let isMounted = true;
    setLoadingChapters(true);
    setError(null);

    const langParam = defaultLanguage && defaultLanguage !== "all" 
      ? `&translatedLanguage[]=${defaultLanguage}` 
      : "&translatedLanguage[]=en";

    const fetchUrl = `/manga/${mangaId}/feed?limit=500&order[chapter]=asc${langParam}&includes[]=scanlation_group`;

    fetchWithCache(fetchUrl)
      .then(async (data) => {
        if (!isMounted) return;

        let chapterList = data.data || [];

        // If no chapters found in preferred language, try fallback without language filter
        if (chapterList.length === 0 && defaultLanguage !== "all") {
          const fallbackData = await fetchWithCache(
            `/manga/${mangaId}/feed?limit=500&order[chapter]=asc&includes[]=scanlation_group`
          );
          chapterList = fallbackData.data || [];
        }

        if (chapterList.length > 0) {
          // Deduplicate chapters by chapter number, keeping unique versions
          const uniqueChapters = [];
          const seen = new Set();

          chapterList.forEach((ch) => {
            const num = ch.attributes?.chapter || "oneshot";
            const lang = ch.attributes?.translatedLanguage || "en";
            const key = `${num}-${lang}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueChapters.push(ch);
            }
          });

          setChapters(uniqueChapters);
          setCurrentChapterIndex(0);
          loadChapterPages(uniqueChapters[0].id);
        } else {
          setError("No readable chapters found for this manga in the selected language.");
        }
      })
      .catch((err) => {
        console.warn("Chapters fetch warning:", err);
        if (isMounted) setError(err.message || "Failed to load chapters");
      })
      .finally(() => {
        if (isMounted) setLoadingChapters(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mangaId, defaultLanguage]);

  // Fetch page images for a specific chapter
  const loadChapterPages = async (chapterId) => {
    setLoadingPages(true);
    setSinglePageIndex(0);

    try {
      const data = await fetchWithCache(`/at-home/server/${chapterId}`);

      if (data?.chapter?.data && data.baseUrl) {
        const baseUrl = data.baseUrl;
        const hash = data.chapter.hash;

        // Build list of high quality pages with direct CDN and fallback proxy
        const pageItems = data.chapter.data.map((filename, idx) => {
          const directUrl = getChapterPageUrl(baseUrl, hash, filename, false);
          return {
            index: idx + 1,
            directUrl,
            proxyUrl: getProxyImageUrl(directUrl),
            filename,
          };
        });

        setPages(pageItems);
      } else {
        setPages([]);
        setError("Unable to retrieve page images for this chapter.");
      }
    } catch (err) {
      console.warn("Chapter pages fetch warning:", err);
      setError(err.message || "Failed to load chapter images");
      setPages([]);
    } finally {
      setLoadingPages(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectChapter = (index) => {
    const num = Number(index);
    if (!isNaN(num) && num >= 0 && num < chapters.length) {
      setCurrentChapterIndex(num);
      loadChapterPages(chapters[num].id);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prev = currentChapterIndex - 1;
      setCurrentChapterIndex(prev);
      loadChapterPages(chapters[prev].id);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const next = currentChapterIndex + 1;
      setCurrentChapterIndex(next);
      loadChapterPages(chapters[next].id);
    }
  };

  const currentChapter = chapters[currentChapterIndex];
  const chapterNumber = currentChapter?.attributes?.chapter || "Special";
  const chapterTitle = currentChapter?.attributes?.title || "";

  return (
    <div className="reader-wrapper">
      {/* Top Reading Progress Bar */}
      <div
        className="reading-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Reader Control Header */}
      <div className="reader-header-bar">
        <div className="reader-nav-left">
          <Link to="/" className="reader-back-btn">
            ‹ Library
          </Link>
          <div className="reader-manga-title">
            <h3>{details?.title || "Manga Reader"}</h3>
            <span className="reader-chapter-badge">
              Ch. {chapterNumber} {chapterTitle ? `— ${chapterTitle}` : ""}
            </span>
          </div>
        </div>

        <div className="reader-nav-controls">
          {/* Chapter Selector Dropdown */}
          {chapters.length > 0 && (
            <select
              className="chapter-select"
              value={currentChapterIndex}
              onChange={(e) => handleSelectChapter(e.target.value)}
              title="Jump to Chapter"
            >
              {chapters.map((ch, idx) => (
                <option key={ch.id} value={idx}>
                  Chapter {ch.attributes?.chapter || "Special"}
                  {ch.attributes?.title ? `: ${ch.attributes.title}` : ""}
                  {ch.attributes?.translatedLanguage ? ` (${ch.attributes.translatedLanguage.toUpperCase()})` : ""}
                </option>
              ))}
            </select>
          )}

          {/* Reading Mode Switcher */}
          <button
            type="button"
            className="reader-mode-btn"
            onClick={() =>
              setReadingMode((m) => (m === "continuous" ? "single" : "continuous"))
            }
            title={
              readingMode === "continuous"
                ? "Switch to Single Page mode"
                : "Switch to Continuous Webtoon Scroll"
            }
          >
            {readingMode === "continuous" ? "📜 Webtoon" : "📄 Single"}
          </button>

          {/* Prev / Next Buttons */}
          <button
            type="button"
            className="reader-btn"
            onClick={handlePrevChapter}
            disabled={currentChapterIndex <= 0}
            title="Previous Chapter"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            className="reader-btn"
            onClick={handleNextChapter}
            disabled={currentChapterIndex >= chapters.length - 1}
            title="Next Chapter"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="reader-body">
        {loadingChapters && (
          <div className="reader-loading">
            <div className="spinner" />
            <p>Loading chapter catalog…</p>
          </div>
        )}

        {!loadingChapters && error && (
          <div className="reader-error">
            <span className="error-icon">⚠️</span>
            <h3>Notice</h3>
            <p>{error}</p>
            <div className="reader-error-actions">
              <Link to="/" className="btn-primary">
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {loadingPages && (
          <div className="reader-loading">
            <div className="spinner" />
            <p>Preparing Chapter {chapterNumber} pages…</p>
          </div>
        )}

        {!loadingPages && !error && pages.length > 0 && (
          <>
            {/* Continuous Webtoon Scroll Mode */}
            {readingMode === "continuous" ? (
              <div className="webtoon-column">
                {pages.map((p) => (
                  <ReaderPage key={p.index} page={p} totalPages={pages.length} />
                ))}
              </div>
            ) : (
              /* Single Page Mode */
              <div className="single-page-viewer">
                <ReaderPage
                  page={pages[singlePageIndex]}
                  totalPages={pages.length}
                />
                <div className="single-nav-bar">
                  <button
                    type="button"
                    className="reader-btn"
                    onClick={() => setSinglePageIndex((i) => Math.max(0, i - 1))}
                    disabled={singlePageIndex === 0}
                  >
                    ‹ Previous Page
                  </button>
                  <span className="page-counter">
                    {singlePageIndex + 1} / {pages.length}
                  </span>
                  <button
                    type="button"
                    className="reader-btn"
                    onClick={() =>
                      setSinglePageIndex((i) => Math.min(pages.length - 1, i + 1))
                    }
                    disabled={singlePageIndex === pages.length - 1}
                  >
                    Next Page ›
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Chapter Switcher Navigation */}
            <div className="reader-bottom-nav">
              <button
                type="button"
                className="reader-btn bottom-btn"
                onClick={handlePrevChapter}
                disabled={currentChapterIndex <= 0}
              >
                ‹ Previous Chapter
              </button>

              <span className="chapter-bottom-indicator">
                Chapter {chapterNumber} of {chapters.length} chapters
              </span>

              <button
                type="button"
                className="reader-btn bottom-btn"
                onClick={handleNextChapter}
                disabled={currentChapterIndex >= chapters.length - 1}
              >
                Next Chapter ›
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Individual Page Renderer with direct CDN loading and proxy fallback on error.
 */
function ReaderPage({ page, totalPages }) {
  const [currentSrc, setCurrentSrc] = useState(page.directUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && page.proxyUrl) {
      setHasError(true);
      setCurrentSrc(page.proxyUrl);
    }
  };

  const retry = () => {
    setHasError(false);
    setIsLoaded(false);
    setCurrentSrc(`${page.directUrl}?retry=${Date.now()}`);
  };

  return (
    <div className="page-image-container">
      {!isLoaded && (
        <div className="page-skeleton shimmer">
          <div className="page-skeleton-indicator">
            Page {page.index} of {totalPages}
          </div>
        </div>
      )}

      {hasError ? (
        <div className="page-failed-card">
          <p>Failed to load Page {page.index}</p>
          <button type="button" className="retry-btn-small" onClick={retry}>
            🔄 Retry Page
          </button>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={`Page ${page.index}`}
          className={`page-image ${isLoaded ? "loaded" : "hidden"}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
        />
      )}
    </div>
  );
}
