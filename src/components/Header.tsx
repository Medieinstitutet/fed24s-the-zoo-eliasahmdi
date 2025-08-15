import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <header className="bg-green-600 dark:bg-green-800 text-white shadow-lg">
      <nav className="container mx-auto flex justify-between items-center p-4">
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
          onClick={toggleTheme}
          className="px-3 py-1 rounded border border-white hover:bg-green-700 dark:hover:bg-green-900 transition"
        >
          {darkMode ? '☀️ Ljust läge' : '🌙 Mörkt läge'}
        </button>
      </nav>
    </header>
  );
};

export default Header;
