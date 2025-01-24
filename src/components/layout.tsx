import React from 'react';
import Navbar from './navbar';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="container mx-auto px-4 py-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default Layout;