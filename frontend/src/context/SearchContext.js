import React, { createContext, useState, useEffect } from "react";
import { fetchWithCache } from "../utils/api";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState("");

  // New settings state
  const [defaultLanguage, setDefaultLanguage] = useState("all");
  const [showNSFW, setShowNSFW] = useState(false);

  // Fetch all tags once using centralized api helper
  useEffect(() => {
    fetchWithCache("/api/manga/tag?limit=100")
      .then((json) => setTags(json.data || []))
      .catch((err) => console.error("Error loading tags:", err));
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        tags,
        selectedTagId,
        setSelectedTagId,
        defaultLanguage,
        setDefaultLanguage,
        showNSFW,
        setShowNSFW,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
