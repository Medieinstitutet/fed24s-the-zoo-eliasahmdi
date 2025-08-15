import React, { useState } from 'react';


interface Props {
  src: string;
  alt: string;
  className?: string;
}

const BildMedFallBack: React.FC<Props> = ({ src, alt, className }) => {
  const [fel, setFel] = useState(false);
  if (fel || !src) {
    return (
      <div
        className={`${
          className ?? ''
        } flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4 space-y-1`}
      >
       
        <span className="text-4xl">🐾</span>
        <span className="text-sm">Ingen bild</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFel(true)}
    />
  );
};

export default BildMedFallBack;