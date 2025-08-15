import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import type { Djur } from '../models/Djur';
import { useHämtaDjur } from '../hooks/useHamtaDjur';

interface DjurState {
  djurLista: Djur[];
}

type DjurAction =
  | { type: 'SET_DJUR'; payload: Djur[] }
  | { type: 'MATA_DJUR'; payload: { id: number; tid: string } };

const initialState: DjurState = {
  djurLista: [],
};

function djurReducer(state: DjurState, action: DjurAction): DjurState {
  switch (action.type) {
    case 'SET_DJUR':
      return { ...state, djurLista: action.payload };
    case 'MATA_DJUR':
      return {
        ...state,
        djurLista: state.djurLista.map((djur) =>
          djur.id === action.payload.id
            ? { ...djur, senastMatad: action.payload.tid }
            : djur
        ),
      };
    default:
      return state;
  }
}
interface DjurContextProps {
  djurLista: Djur[];
  mataDjur: (id: number) => void;
  laddar: boolean;
  fel: string | null;
}

export const DjurContext = createContext<DjurContextProps | undefined>(undefined);

export const DjurProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { djur, laddar, fel } = useHämtaDjur();
  const [state, dispatch] = useReducer(djurReducer, initialState);

  useEffect(() => {
    if (!laddar && djur.length > 0) {
      let sparadeTider: Record<number, string> = {};
      const sparat = localStorage.getItem('djur-feed');
      if (sparat) {
        try {
          sparadeTider = JSON.parse(sparat);
        } catch {
        }
      }
      const uppdaterade = djur.map((d) => {
        const lokalTid = sparadeTider[d.id];
        if (lokalTid) {
          return { ...d, senastMatad: lokalTid };
        }
        return d;
      });
      dispatch({ type: 'SET_DJUR', payload: uppdaterade });
    }
  }, [laddar, djur]);

  
  const mataDjur = (id: number) => {
    const tidNu = new Date().toISOString();
    dispatch({ type: 'MATA_DJUR', payload: { id, tid: tidNu } });
    
    let sparadeTider: Record<number, string> = {};
    const sparat = localStorage.getItem('djur-feed');
    if (sparat) {
      try {
        sparadeTider = JSON.parse(sparat);
      } catch {
        sparadeTider = {};
      }
    }
    sparadeTider[id] = tidNu;
    localStorage.setItem('djur-feed', JSON.stringify(sparadeTider));

    
    try {
      const histRaw = localStorage.getItem('djur-historik');
      let historik: Record<number, string[]> = {};
      if (histRaw) {
        historik = JSON.parse(histRaw);
      }
      if (!Array.isArray(historik[id])) {
        historik[id] = [];
      }
      historik[id].push(tidNu);
      localStorage.setItem('djur-historik', JSON.stringify(historik));
    } catch {
      
    }
  };

  return (
    <DjurContext.Provider value={{ djurLista: state.djurLista, mataDjur, laddar, fel }}>
      {children}
    </DjurContext.Provider>
  );
};