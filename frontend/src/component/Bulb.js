import React, { useContext } from "react";
import { motion } from "framer-motion";
import moonImg from "../assets/moon.png";
import sunImg from "../assets/sun.png";
import { ThemeContext } from "../utils/ThemeContext";

const CelestialToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className="scene">
      <motion.div
        className="celestial-wrapper"
        initial={{ rotate: -15 }}
        animate={{ rotate: [-15, 15, 0] }}
        transition={{ type: "tween", ease: "easeInOut", duration: 3 }}
        whileHover={{ rotate: [0, 15, -15, 0] }}
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
            src={darkMode ? moonImg : sunImg}
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

// const HangingBulb = () => {
//   const [isOn, setIsOn] = useState(false);

//   const handleToggle = () => {
//     setIsOn((prev) => !prev);
//   };

//   return (
//     <div className="scene">
//       <motion.div
//         className="bulb-wrapper"
//         initial={{ rotate: 0 }}
//         animate={{
//           rotate: [-5, 5, -5],
//         }}
//         whileHover={{
//           rotate: [0, -8, 8, 0],
//         }}
//         transition={{
//           type: "spring",
//           stiffness: 30,
//           damping: 8,
//           repeat: Infinity,
//           repeatType: "reverse",
//           duration: 3,
//         }}
//       >
//         <motion.div
//           className="cable"
//           animate={{
//             rotate: [-2, 2, -2],
//           }}
//           transition={{
//             type: "spring",
//             stiffness: 40,
//             damping: 10,
//             repeat: Infinity,
//             repeatType: "reverse",
//             duration: 3,
//           }}
//         />

//         <motion.div
//           className="bulb-container"
//           onClick={handleToggle}
//           whileHover={{
//             rotate: [0, -5, 5, 0],
//             scale: 1.05,
//           }}
//           transition={{ type: "spring", stiffness: 50, damping: 5 }}
//         >
//           <img src={bulbOff} alt="Bulb" className="bulb-img" />
//           {isOn && <div className="glow"></div>}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default HangingBulb;
