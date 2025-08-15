import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DjurContext } from '../context/DjurContext';
import BildMedFallBack from '../components/BildMedFallBack';

const DjurÖversikt: React.FC = () => {
  const ctx = useContext(DjurContext);
  if (!ctx) return <div>Context saknas</div>;
  const { djurLista, laddar, fel } = ctx;

  const [sökTerm, setSökTerm] = useState('');
  const [sortering, setSortering] = useState('namn-asc');
  const [visaFavoriter, setVisaFavoriter] = useState(false);

  const [favoriter, setFavoriter] = useState<number[]>(() => {
    const favRaw = localStorage.getItem('favorit-djur');
    return favRaw ? JSON.parse(favRaw) : [];
  });

  const toggleFavorit = (id: number) => {
    setFavoriter((prev) => {
      let nya;
      if (prev.includes(id)) {
        nya = prev.filter((fid) => fid !== id);
      } else {
        nya = [...prev, id];
      }
      localStorage.setItem('favorit-djur', JSON.stringify(nya));
      return nya;
    });
  };

  const [timer, setTimer] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const beräknaStatus = (senastMatad: string | undefined) => {
    if (!senastMatad) return { text: 'Okänt', färg: 'gray' };
    const diff = (Date.now() - new Date(senastMatad).getTime()) / (1000 * 60 * 60);
    if (diff >= 5) return { text: 'Behöver mat', färg: 'red' };
    if (diff >= 3) return { text: 'Hungrig snart', färg: 'yellow' };
    return { text: 'Mätt', färg: 'green' };
  };

  if (laddar) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
      </div>
    );
  }
  if (fel) {
    return <div>Något gick fel: {fel}</div>;
  }

  let filtrerade = djurLista.filter((d) =>
    d.namn.toLowerCase().includes(sökTerm.toLowerCase()) ||
    d.kortBeskrivning.toLowerCase().includes(sökTerm.toLowerCase())
  );

  if (visaFavoriter) {
    filtrerade = filtrerade.filter((d) => favoriter.includes(d.id));
  }

  const sortFunctions: { [key: string]: (a: any, b: any) => number } = {
    'namn-asc': (a, b) => a.namn.localeCompare(b.namn, 'sv'),
    'namn-desc': (a, b) => b.namn.localeCompare(a.namn, 'sv'),
    'fodelseAr-asc': (a, b) => a.fodelseAr - b.fodelseAr,
    'fodelseAr-desc': (a, b) => b.fodelseAr - a.fodelseAr,
  };
  const sortFn = sortFunctions[sortering] ?? sortFunctions['namn-asc'];
  const sorterade = [...filtrerade].sort(sortFn);

  return (
    <div className="animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Sök djur..."
          value={sökTerm}
          onChange={(e) => setSökTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600"
        />
        <select
          value={sortering}
          onChange={(e) => setSortering(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="namn-asc">Sortera: Namn A–Ö</option>
          <option value="namn-desc">Sortera: Namn Ö–A</option>
          <option value="fodelseAr-asc">Sortera: Äldst först</option>
          <option value="fodelseAr-desc">Sortera: Yngst först</option>
        </select>
        <button
          onClick={() => setVisaFavoriter((prev) => !prev)}
          className={`px-4 py-2 rounded-md text-white transition ${
            visaFavoriter
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          {visaFavoriter ? 'Visa alla djur' : 'Visa favoriter'}
        </button>
      </div>

     
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sorterade.map((djur) => {
          const status = beräknaStatus(djur.senastMatad);
          const favoritMarkerad = favoriter.includes(djur.id);
          let statusFärgKlasser =
            status.färg === 'green'
              ? 'bg-green-600'
              : status.färg === 'yellow'
              ? 'bg-yellow-500'
              : status.färg === 'red'
              ? 'bg-red-600'
              : 'bg-gray-400';

          return (
            <div
              key={djur.id}
              className="relative border rounded-lg shadow hover:shadow-xl transition-transform transform hover:scale-105 bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
            >
              
              <button
                onClick={() => toggleFavorit(djur.id)}
                className="absolute top-2 left-2 z-10 text-yellow-400 text-2xl"
                title={favoritMarkerad ? 'Ta bort från favoriter' : 'Lägg till som favorit'}
              >
                {favoritMarkerad ? '★' : '☆'}
              </button>

              <Link to={`/djur/${djur.id}`}>
                <div className="relative">
                  <BildMedFallBack
                    src={djur.bildUrl}
                    alt={djur.namn}
                    className="w-full h-40 object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full text-white ${statusFärgKlasser}`}
                  >
                    {status.text}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-lg font-semibold">{djur.namn}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 overflow-hidden">
                    {djur.kortBeskrivning}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DjurÖversikt;
