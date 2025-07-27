import { useState, useEffect, useRef, useCallback } from "react";
import { fetchWithCache } from "../utils/api";

export function useManga({ tagId="", language="all", showNSFW=false, page=1 }) {
   const [manga, setManga] = useState([])
   const PAGE_SIZE = 20
   const offset = (page - 1) * PAGE_SIZE

   const mapData = useCallback(raw => raw.map(m => {
     const art = m.relationships.find(r => r.type==="cover_art")
     return {
       id: m.id,
       title: m.attributes.title?.en ?? "No Title",
       coverFilename: art?.attributes?.fileName,
       contentRating: m.attributes.contentRating,
       availableLangs: m.attributes.availableTranslatedLanguages ?? [],
     }
   }), [])

   useEffect(() => {

    let url = `https://api.mangadex.org/manga?limit=${PAGE_SIZE}&offset=${offset}&includes[]=cover_art`
     if (tagId) url += `&includedTags[]=${tagId}`

    fetchWithCache(url)
       .then(json => {
         let list = mapData(json.data)
         if (language !== "all") {
           list = list.filter(m => m.availableLangs.includes(language))
         }
         if (!showNSFW) {
           list = list.filter(m => m.contentRating !== "erotica")
         }
         setManga(list)
       })
       .catch(console.error)
   }, [tagId, language, showNSFW, page, offset, mapData])

   return manga
 }

 export function useCompletedManga() {
   const [completed, setCompleted] = useState([])

   useEffect(() => {

    fetchWithCache("https://api.mangadex.org/manga?limit=20&includes[]=cover_art&status[]=completed")
       .then(json => {
         const mapped = json.data.map(m => {
           const art = m.relationships.find(r => r.type==="cover_art")
           return {
             id: m.id,
             title: m.attributes.title?.en ?? "No Title",
             coverFilename: art?.attributes?.fileName,
           }
         })
         setCompleted(mapped)
       })
       .catch(console.error)
   }, [])

   return completed
 }