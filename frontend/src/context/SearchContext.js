// frontend/src/context/SearchContext.js
import React, { createContext, useState, useEffect } from "react";
import { fetchWithCache } from "../utils/api";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [selectedTagName, setSelectedTagName] = useState("");
  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem("sk_sort_order") || "latestUploadedChapter.desc";
  });
  const [statusFilter, setStatusFilter] = useState("all");

  // User preference settings
  const [defaultLanguage, setDefaultLanguage] = useState(() => {
    return localStorage.getItem("sk_default_lang") || "en";
  });
  const [showNSFW, setShowNSFW] = useState(() => {
    return localStorage.getItem("sk_show_nsfw") === "true";
  });

  // Debounce search input for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("sk_default_lang", defaultLanguage);
  }, [defaultLanguage]);

  useEffect(() => {
    localStorage.setItem("sk_show_nsfw", String(showNSFW));
  }, [showNSFW]);

  useEffect(() => {
    localStorage.setItem("sk_sort_order", sortOrder);
  }, [sortOrder]);

  // Fetch all tags once
  useEffect(() => {
    fetchWithCache("/manga/tag")
      .then((json) => {
        const rawTags = json.data || [];
        // Sort tags alphabetically by English name
        const sorted = rawTags
          .filter((t) => t.attributes?.name?.en)
          .sort((a, b) =>
            a.attributes.name.en.localeCompare(b.attributes.name.en)
          );
        setTags(sorted);
      })
      .catch((err) => console.warn("Failed to load manga tags:", err));
  }, []);

  const selectTag = (tagId, tagName = "") => {
    setSelectedTagId(tagId);
    setSelectedTagName(tagName);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedTagId("");
    setSelectedTagName("");
    setStatusFilter("all");
    setSortOrder("latestUploadedChapter.desc");
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        debouncedQuery,
        tags,
        selectedTagId,
        selectedTagName,
        selectTag,
        setSelectedTagId,
        sortOrder,
        setSortOrder,
        statusFilter,
        setStatusFilter,
        defaultLanguage,
        setDefaultLanguage,
        showNSFW,
        setShowNSFW,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
