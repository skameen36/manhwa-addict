// frontend/src/hooks/useManga.js
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchWithCache } from "../utils/api";

const PAGE_SIZE = 24;

/**
 * Helper to safely extract title in English, Romanized, or first available language.
 */
export function extractTitle(attributes) {
  if (!attributes?.title) return "Untitled Manga";
  const titles = attributes.title;
  return (
    titles.en ||
    titles["ja-ro"] ||
    titles["ko-ro"] ||
    titles["zh-ro"] ||
    titles.ja ||
    titles.ko ||
    titles.zh ||
    Object.values(titles)[0] ||
    "Untitled Manga"
  );
}

/**
 * Helper to safely extract description text.
 */
export function extractDescription(attributes) {
  if (!attributes?.description) return "";
  const desc = attributes.description;
  return desc.en || Object.values(desc)[0] || "";
}

/**
 * Maps raw MangaDex manga object to clean frontend model.
 */
export function mapMangaItem(raw) {
  const art = raw.relationships?.find((r) => r.type === "cover_art");
  const author = raw.relationships?.find((r) => r.type === "author");
  const artist = raw.relationships?.find((r) => r.type === "artist");

  const tags = (raw.attributes?.tags || [])
    .map((t) => t.attributes?.name?.en)
    .filter(Boolean);

  return {
    id: raw.id,
    title: extractTitle(raw.attributes),
    description: extractDescription(raw.attributes),
    coverFilename: art?.attributes?.fileName || null,
    status: raw.attributes?.status || "ongoing",
    contentRating: raw.attributes?.contentRating || "safe",
    year: raw.attributes?.year || null,
    tags: tags.slice(0, 4),
    lastChapter: raw.attributes?.lastChapter || null,
    authorName: author?.attributes?.name || null,
    artistName: artist?.attributes?.name || null,
    availableLangs: raw.attributes?.availableTranslatedLanguages || [],
  };
}

/**
 * Main hook to query manga catalog with live search, tags, sort, and pagination.
 */
export function useManga({
  searchQuery = "",
  tagId = "",
  language = "all",
  showNSFW = false,
  sortOrder = "latestUploadedChapter.desc",
  statusFilter = "all",
  page = 1,
}) {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const offset = (page - 1) * PAGE_SIZE;

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("limit", String(PAGE_SIZE));
      params.append("offset", String(offset));
      params.append("includes[]", "cover_art");
      params.append("includes[]", "author");
      params.append("includes[]", "artist");

      // Content rating filters
      params.append("contentRating[]", "safe");
      params.append("contentRating[]", "suggestive");
      if (showNSFW) {
        params.append("contentRating[]", "erotica");
      }

      // Title search
      if (searchQuery.trim()) {
        params.append("title", searchQuery.trim());
      }

      // Tag filter
      if (tagId) {
        params.append("includedTags[]", tagId);
      }

      // Status filter
      if (statusFilter && statusFilter !== "all") {
        params.append("status[]", statusFilter);
      }

      // Language filter
      if (language && language !== "all") {
        params.append("availableTranslatedLanguage[]", language);
      }

      // Sorting
      if (sortOrder) {
        const [field, direction] = sortOrder.split(".");
        if (field && direction) {
          params.append(`order[${field}]`, direction);
        }
      }

      const url = `/manga?${params.toString()}`;
      const json = await fetchWithCache(url);

      if (json && Array.isArray(json.data)) {
        const mapped = json.data.map(mapMangaItem);
        setManga(mapped);
        setTotal(json.total || mapped.length);
      } else {
        setManga([]);
        setTotal(0);
      }
    } catch (err) {
      console.warn("useManga warning:", err);
      setError(err.message || "Failed to load manga catalog");
      setManga([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, tagId, language, showNSFW, sortOrder, statusFilter, offset]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    manga,
    loading,
    error,
    total,
    totalPages,
    refetch: fetchCatalog,
  };
}

/**
 * Hook to fetch top featured / spotlight manga.
 */
export function useFeaturedManga() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const url = "/manga?limit=6&order[followedCount]=desc&includes[]=cover_art&includes[]=author&contentRating[]=safe&contentRating[]=suggestive";

    fetchWithCache(url)
      .then((json) => {
        if (isMounted && json?.data) {
          setFeatured(json.data.map(mapMangaItem));
        }
      })
      .catch((err) => console.warn("Featured manga warning:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { featured, loading };
}

/**
 * Hook to fetch popular completed or trending manga for sidebar.
 */
export function usePopularManga() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const url = "/manga?limit=10&order[followedCount]=desc&includes[]=cover_art&status[]=completed&contentRating[]=safe";

    fetchWithCache(url)
      .then((json) => {
        if (isMounted && json?.data) {
          setPopular(json.data.map(mapMangaItem));
        }
      })
      .catch((err) => console.warn("Popular manga warning:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { popular, loading };
}

/**
 * Hook to fetch detailed info for a single manga.
 */
export function useMangaDetails(mangaId) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mangaId) return;
    let isMounted = true;
    setLoading(true);

    const url = `/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`;

    fetchWithCache(url)
      .then((json) => {
        if (isMounted && json?.data) {
          setDetails(mapMangaItem(json.data));
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load manga details");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mangaId]);

  return { details, loading, error };
}