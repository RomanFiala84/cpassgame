// src/components/shared/PageTransition.js
// ✅ VYLEPŠENÁ VERZIA - Plynulejšie prechody s lepším timing


import { motion } from 'framer-motion';


const pageVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(4px)' // ✅ Začne rozmazané
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)', // ✅ Postupne sa doostri
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    opacity: 0,
    filter: 'blur(4px)', // ✅ Rozmaže sa pri odchode
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};



export const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ 
        position: 'relative',
        zIndex: 1,
        willChange: 'opacity'
      }}
    >
      {children}
    </motion.div>
  );
};


export default PageTransition;
