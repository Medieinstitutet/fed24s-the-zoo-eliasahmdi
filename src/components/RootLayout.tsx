import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const RootLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-green-600 dark:bg-green-700 text-white shadow">
        <nav className="container mx-auto flex items-center justify-between gap-6 p-4">
          <div className="flex gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `hover:underline ${isActive ? 'font-bold underline' : ''}`
              }
            >
              Hem
            </NavLink>
            <NavLink
              to="/djur"
              className={({ isActive }) =>
                `hover:underline ${isActive ? 'font-bold underline' : ''}`
              }
            >
              Djur
            </NavLink>
          </div>

          <button
            onClick={toggleDarkMode}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300 dark:border-gray-700"
            title="Växla mörkt läge"
          >
            <AnimatePresence mode="wait" initial={false}>
              {darkMode ? (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <MoonIcon className="w-6 h-6 text-yellow-400" />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SunIcon className="w-6 h-6 text-yellow-500" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
