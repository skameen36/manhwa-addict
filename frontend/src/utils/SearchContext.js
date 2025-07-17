import React, { createContext, useState, useEffect } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState("");

  // New settings state
  const [defaultLanguage, setDefaultLanguage] = useState("all");
  const [showNSFW, setShowNSFW] = useState(false);

  // Fetch all tags once
  useEffect(() => {
    fetch("https://api.mangadex.org/manga/tag?limit=100")
      .then((res) => res.json())
      .then((json) => setTags(json.data || []))
      .catch((err) => console.error("Error loading tags:", err));
  }, []);

  console.log("SearchContext initialized with tags:", tags);

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
