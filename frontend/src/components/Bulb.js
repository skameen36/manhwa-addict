import  { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const CelestialToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const bulbUrl = new URL("../assets/bulb3.png", import.meta.url);
  const bulbOff = new URL("../assets/bulb.png", import.meta.url);

  return (
    <div className="scene">
      <motion.div
        className="celestial-wrapper"
        initial={{ rotate: -15 }}
        animate={{ rotate: [0,-15, 15, 0] }}
        transition={{ type: "tween", ease: "easeInOut", duration: 3 }}
        whileHover={{ rotate: [0, 9, -9, 0] }}
      >
        <div className="thread" />

        <motion.div
          className="celestial-body"
          onClick={toggleDarkMode}
          whileHover={{
            y: -10,
            scale: 1.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 5 }}
        >
          <img
            src={darkMode ? bulbOff : bulbUrl.href}
            alt={darkMode ? "Moon" : "Sun"}
            className="celestial-img"
          />
          <div className={`glow ${darkMode ? "moon-glow" : "sun-glow"}`} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CelestialToggle;
