import React from 'react';
import { Link } from 'react-router-dom';


const Startsida: React.FC = () => {
  return (
    <section
      className="animate-fadeIn relative overflow-hidden py-24 text-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-8">
        <span className="text-5xl select-none">🐾</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
          Välkommen till vårt Zoo
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Utforska våra fantastiska djur och lär dig mer om deras unika egenskaper. Klicka
          dig vidare för att se vilka djur som finns och när de behöver matas!
        </p>
        <Link
          to="/djur"
          className="inline-block px-10 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition transform active:scale-95"
        >
          Visa djuren
        </Link>
      </div>
     
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-green-200 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-50"></div>
      </div>
    </section>
  );
};

export default Startsida;