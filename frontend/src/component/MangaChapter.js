// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const MangaChapters = () => {
//   const { mangaId } = useParams();
//   const [chapters, setChapters] = useState([]);
//   const [currentChapter, setCurrentChapter] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchChapters();
//   }, [mangaId]);

//   const fetchChapters = async () => {
//     try {
//       const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?limit=10`);
//       const data = await response.json();

//       setChapters(data.data);
//       if (data.data.length > 0) setCurrentChapter(data.data[0]);
//     } catch (error) {
//       console.error("Error fetching chapters:", error);
//     }
//   };

//   const getImageUrls = async (chapterId) => {
//     try {
//       const response = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
//       const data = await response.json();

//       return data.chapter.data.map(img => `https://uploads.mangadex.org/data/${data.chapter.hash}/${img}`);
//     } catch (error) {
//       console.error("Error fetching chapter images:", error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     if (currentChapter) {
//       getImageUrls(currentChapter.id).then(images => setCurrentChapter(prev => ({ ...prev, images })));
//     }
//   }, [currentChapter]);

//   const changeChapter = (direction) => {
//     const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id);
//     if (currentIndex === -1) return;

//     const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
//     if (newIndex >= 0 && newIndex < chapters.length) {
//       setCurrentChapter(chapters[newIndex]);
//     }
//   };

//   return (
//     <div className="chapter-container">
//       <h2>Chapter {currentChapter?.attributes?.chapter}</h2>

//       <div className="images-column">
//         {currentChapter?.images?.map((url, index) => (
//           <img key={index} src={url} alt={`Page ${index + 1}`} />
//         ))}
//       </div>

//       <div className="chapter-controls">
//         <button onClick={() => changeChapter("prev")} disabled={!chapters.length || currentChapter === chapters[0]}>Prev Chapter</button>
//         <button onClick={() => changeChapter("next")} disabled={!chapters.length || currentChapter === chapters[chapters.length - 1]}>Next Chapter</button>
//       </div>

//       <button onClick={() => navigate("/")}>Back to Manga List</button>
//     </div>
//   );
// };

// export default MangaChapters;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const MangaChapters = () => {
  const { mangaId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // Fetch all chapters of the manga
  const fetchChapters = async () => {
    try {
      const response = await fetch(
        `https://api.mangadex.org/manga/${mangaId}/feed?limit=500&order[chapter]=asc`
      );
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setChapters(data.data);
        setCurrentChapterIndex(0); // Set the first chapter as default
        getImageUrls(data.data[0].id); // Fetch images for the first chapter
      } else {
        console.error("No chapters found for this manga.");
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  // Fetch image URLs for the current chapter
  const getImageUrls = async (chapterId) => {
    try {
      const response = await fetch(
        `https://api.mangadex.org/at-home/server/${chapterId}`
      );
      const data = await response.json();
      if (data.chapter && data.chapter.data) {
        const urls = data.chapter.data.map(
          (img) => `https://uploads.mangadex.org/data/${data.chapter.hash}/${img}`
        );
        setImages(urls);
      } else {
        console.error("No images found for this chapter.");
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching chapter images:", error);
    }
  };

  // Handle Next Chapter Button
  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      getImageUrls(chapters[nextIndex].id);
    }
  };

  // Handle Previous Chapter Button
  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIndex);
      getImageUrls(chapters[prevIndex].id);
    }
  };

  // Fetch chapters on component mount
  useEffect(() => {
    fetchChapters();
  }, [mangaId]);

  return (
    <div className="chapter-container">
      <h2>
        Chapter {chapters[currentChapterIndex]?.attributes?.chapter || "N/A"}
      </h2>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevChapter}
          disabled={currentChapterIndex === 0}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            cursor: currentChapterIndex === 0 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNextChapter}
          disabled={currentChapterIndex === chapters.length - 1}
          style={{
            padding: "10px 20px",
            cursor:
              currentChapterIndex === chapters.length - 1
                ? "not-allowed"
                : "pointer",
          }}
        >
          Next
        </button>
      </div>

      <div className="images-column">
        {images.length > 0 ? (
          images.map((url, index) => (
            <LazyImage key={index} src={url} alt={`Page ${index + 1}`} />
          ))
        ) : (
          <p>No images available for this chapter.</p>
        )}
      </div>

      <button onClick={() => navigate("/")}>Back to Manga List</button>
    </div>
  );
};

// Lazy Image Component for Optimized Loading
const LazyImage = ({ src, alt }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} style={{ minHeight: "500px" }}>
      {inView ? (
        <img
          src={src}
          alt={alt}
          onError={(e) => (e.target.src = "/placeholder.jpg")}
          loading="lazy"
          style={{ width: "100%", marginBottom: "10px" }}
        />
      ) : (
        <div style={{ height: "500px", backgroundColor: "#222" }} />
      )}
    </div>
  );
};

export default MangaChapters;
