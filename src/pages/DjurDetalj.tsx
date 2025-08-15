import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DjurContext } from '../context/DjurContext';
import BildMedFallBack from '../components/BildMedFallBack';
import { motion, AnimatePresence } from 'framer-motion';

const DjurDetalj: React.FC = () => {
  const { djurId } = useParams<{ djurId: string }>();
  const ctx = useContext(DjurContext);
  if (!ctx) return <div>Context saknas</div>;
  const { djurLista, mataDjur } = ctx;
  const id = Number(djurId);
  const djur = djurLista.find((d) => d.id === id);

  if (!djur) {
    return (
      <div className="animate-fadeIn dark:text-gray-200">
        <p>Kunde inte hitta djuret.</p>
        <Link to="/djur" className="text-blue-600 hover:underline dark:text-blue-400">
          Tillbaka till listan
        </Link>
      </div>
    );
  }

  //tidsräkning
  const [tidSedanMatning, setTidSedanMatning] = useState<string>('');
  useEffect(() => {
    if (!djur?.senastMatad) return;
    const uppdateraTid = () => {
      const diffMs = Date.now() - new Date(djur.senastMatad).getTime();
      const diffSek = Math.floor(diffMs / 1000);
      const timmar = Math.floor(diffSek / 3600);
      const minuter = Math.floor((diffSek % 3600) / 60);
      const sekunder = diffSek % 60;
      if (timmar > 0) {
        setTidSedanMatning(`${timmar} tim ${minuter} min ${sekunder} s sedan`);
      } else if (minuter > 0) {
        setTidSedanMatning(`${minuter} min ${sekunder} s sedan`);
      } else {
        setTidSedanMatning(`${sekunder} s sedan`);
      }
    };
    uppdateraTid();
    const interval = setInterval(uppdateraTid, 1000);
    return () => clearInterval(interval);
  }, [djur?.senastMatad]);

 //ikon
  const fåMatIkon = (namn: string) => {
    const lower = namn.toLowerCase();
    if (['lejon', 'tiger', 'björn'].some(animal => lower.includes(animal))) return '🥩';
    if (['pingvin', 'delfin', 'säl', 'haj'].some(animal => lower.includes(animal))) return '🐟';
    if (['kanin', 'marsvin', 'hamster'].some(animal => lower.includes(animal))) return '🥕';
    return '🍏';
  };

  const [matIkon, setMatIkon] = useState(fåMatIkon(djur.namn));
  const [showIcon, setShowIcon] = useState(false);
  const [matadMeddelande, setMatadMeddelande] = useState(false);


  const diffHrs = djur.senastMatad
    ? (Date.now() - new Date(djur.senastMatad).getTime()) / (1000 * 60 * 60)
    : Infinity;
  let meddelande = '';
  let disable = false;
  if (diffHrs < 3) {
    meddelande = 'Djuret är mätt.';
    disable = true;
  } else if (diffHrs < 4) {
    meddelande = 'Djuret börjar bli hungrigt.';
    disable = true;
  } else {
    meddelande = 'Djuret är hungrigt.';
    disable = false;
  }

  const mata = () => {
    if (!disable) {
      mataDjur(djur.id);
      setMatIkon(fåMatIkon(djur.namn));
      setShowIcon(true);
      setMatadMeddelande(true);
      setTimeout(() => setShowIcon(false), 1000);
      setTimeout(() => setMatadMeddelande(false), 2000);
    }
  };

 
  let historikLista: string[] = [];
  try {
    const histRaw = localStorage.getItem('djur-historik');
    if (histRaw) {
      const allHist: Record<number, string[]> = JSON.parse(histRaw);
      historikLista = Array.isArray(allHist[djur.id]) ? allHist[djur.id] : [];
    }
  } catch {
    historikLista = [];
  }
  const senasteTre = [...historikLista].slice(-3).reverse();

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow relative dark:text-gray-200">
     
      <AnimatePresence>
        {showIcon && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -50 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 1 }}
            className="absolute left-1/2 transform -translate-x-1/2 text-4xl"
          >
            {matIkon}
          </motion.span>
        )}
      </AnimatePresence>

      <Link to="/djur" className="text-blue-600 hover:underline dark:text-blue-400">
        ← Tillbaka
      </Link>

      <div className="flex flex-col md:flex-row mt-4 gap-6">
        <BildMedFallBack
          src={djur.bildUrl}
          alt={djur.namn}
          className="w-full md:w-1/2 h-64 object-cover rounded-lg shadow"
        />
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold">{djur.namn}</h2>
          <p><span className="font-semibold">Latinskt namn:</span> {djur.latinsktNamn}</p>
          <p><span className="font-semibold">Födelseår:</span> {djur.fodelseAr}</p>
          <p><span className="font-semibold">Medicin:</span> {djur.medicin || 'Ingen'}</p>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{djur.beskrivning}</p>
          <p className="italic text-sm">Senast matad: {tidSedanMatning || 'Okänt'}</p>
          <p className="font-medium">{meddelande}</p>
          {matadMeddelande && (
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Djuret matades nyss!
            </p>
          )}

          <button
            onClick={mata}
            disabled={disable}
            className={`px-4 py-2 rounded-md text-white transition-colors transform active:scale-95 ${
              disable
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Mata djur
          </button>

          {senasteTre.length > 0 && (
            <div className="pt-4">
              <p className="text-sm font-semibold mb-1">Senaste matningstillfällen:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {senasteTre.map((t, idx) => (
                  <li key={idx}>{new Date(t).toLocaleString('sv-SE')}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DjurDetalj;
