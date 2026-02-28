// src/components/shared/PageTransition.js
// ✅ FINÁLNA VERZIA - Iba fade in/out, žiadny posun

import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0
    // ✅ ODSTRÁNENÉ - y: 20 (spôsobovalo skok)
  },
  animate: {
    opacity: 1,
    // ✅ ODSTRÁNENÉ - y: 0
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    // ✅ ODSTRÁNENÉ - y: -20 (spôsobovalo skok)
    transition: {
      duration: 0.2,
      ease: 'easeIn'
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
        // ✅ PRIDANÉ - Zabráni posunu počas animácie
        willChange: 'opacity'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
