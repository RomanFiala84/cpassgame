// src/components/shared/PageTransition.js
// FINÁLNA VERZIA - Neovplyvňuje fixed elementy (modály)

import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
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
        zIndex: 1
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
