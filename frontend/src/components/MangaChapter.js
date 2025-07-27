import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { fetchWithCache } from "../utils/api";

const MangaChapters = () => {
  const { mangaId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();


  const fetchChapters = async () => {
    try {
      const data = await fetchWithCache(
        `/api/manga/${mangaId}/feed?limit=500&order[chapter]=asc`
      );
     

      if (data.data && data.data.length > 0) {
        setChapters(data.data);
        setCurrentChapterIndex(0); 
        getImageUrls(data.data[0].id); 
      } else {
        console.error("No chapters found for this manga.");
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };


  const getImageUrls = async (chapterId) => {
    try {
      const data = await fetchWithCache(`/api/at-home/server/${chapterId}`);
    
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


  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIndex);
      getImageUrls(chapters[nextIndex].id);
    }
  };


  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIndex);
      getImageUrls(chapters[prevIndex].id);
    }
  };


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
