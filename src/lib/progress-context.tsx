"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  etatVide,
  progressStore,
  type EtapeResultat,
  type ProgressState,
} from "./progress-store";

interface ProgressContextValue {
  etat: ProgressState;
  /** Passe à true une fois la progression chargée depuis le stockage. */
  charge: boolean;
  enregistrer: (resultat: EtapeResultat) => Promise<void>;
  reinitialiser: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<ProgressState>(etatVide);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    let actif = true;
    progressStore.charger().then((e) => {
      if (actif) {
        setEtat(e);
        setCharge(true);
      }
    });
    return () => {
      actif = false;
    };
  }, []);

  const enregistrer = useCallback(async (resultat: EtapeResultat) => {
    const suivant = await progressStore.enregistrer(resultat);
    setEtat(suivant);
  }, []);

  const reinitialiser = useCallback(async () => {
    const suivant = await progressStore.reinitialiser();
    setEtat(suivant);
  }, []);

  return (
    <ProgressContext.Provider value={{ etat, charge, enregistrer, reinitialiser }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress doit être utilisé dans <ProgressProvider>");
  return ctx;
}
