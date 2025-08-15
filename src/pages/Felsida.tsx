import React from 'react';
import { useRouteError } from 'react-router-dom';

const Felsida: React.FC = () => {
  const error: any = useRouteError();
  console.error(error);
  return (
    <div className="animate-fadeIn max-w-xl mx-auto text-center py-20">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Hoppsan!</h1>
      <p className="mb-2 text-gray-700">Något gick fel när sidan skulle visas.</p>
      {error?.statusText || error?.message ? (
        <p className="text-sm text-gray-600 italic">
          {error.statusText || error.message}
        </p>
      ) : null}
    </div>
  );
};

export default Felsida;