import { useState, useEffect } from 'react';
import type { Djur } from '../models/Djur';

export function useHämtaDjur() {
  const [djur, setDjur] = useState<Djur[]>([]);
  const [laddar, setLaddar] = useState<boolean>(true);
  const [fel, setFel] = useState<string | null>(null);

  useEffect(() => {
    async function hämta() {
      try {
        const res = await fetch('https://animals.azurewebsites.net/api/animals');
        if (!res.ok) {
          throw new Error('Kunde inte hämta djurdata');
        }
        const data = await res.json();
        
        const transformerade: Djur[] = data.map((d: any) => ({
          id: d.id,
          namn: d.name,
          latinsktNamn: d.latinName,
          fodelseAr: d.yearOfBirth,
          kortBeskrivning: d.shortDescription,
          beskrivning: d.description,
          bildUrl: d.imageUrl,
          medicin: d.medicine,
          arMatad: d.isFed,
          senastMatad: d.lastFed,
        }));
        setDjur(transformerade);
      } catch (error: any) {
        setFel(error?.message || 'Ett fel uppstod vid hämtning av djuren');
      } finally {
        setLaddar(false);
      }
    }
    hämta();
  }, []);

  return { djur, laddar, fel };
}