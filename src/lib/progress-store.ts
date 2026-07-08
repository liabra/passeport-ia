/**
 * Abstraction de stockage de la progression.
 *
 * L'interface est *asynchrone* à dessein : la v1 écrit dans localStorage, mais
 * on pourra brancher une synchronisation serveur plus tard sans réécrire les
 * composants (qui n'attaquent jamais localStorage directement).
 */

export const PROGRESS_VERSION = 1;

export interface EtapeResultat {
  etapeId: string;
  /** ISO 8601 — moment d'obtention du tampon. */
  termineeLe: string;
  /** Rang éventuel (ex. « Enquêteur », « Coup de poker »). */
  rang?: string;
  /** Métadonnées libres propres à l'activité (score, méthode…). */
  meta?: Record<string, string | number>;
}

export interface ProgressState {
  version: number;
  resultats: Record<string, EtapeResultat>;
}

export interface ProgressStore {
  charger(): Promise<ProgressState>;
  enregistrer(resultat: EtapeResultat): Promise<ProgressState>;
  reinitialiser(): Promise<ProgressState>;
}

export function etatVide(): ProgressState {
  return { version: PROGRESS_VERSION, resultats: {} };
}

const CLE = "passeport-ia:progression";

function estResultat(valeur: unknown): valeur is EtapeResultat {
  return (
    typeof valeur === "object" &&
    valeur !== null &&
    typeof (valeur as EtapeResultat).etapeId === "string" &&
    typeof (valeur as EtapeResultat).termineeLe === "string"
  );
}

function lireDepuisLocal(): ProgressState {
  if (typeof window === "undefined") return etatVide();
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return etatVide();
    const parsed: unknown = JSON.parse(brut);
    if (typeof parsed !== "object" || parsed === null) return etatVide();
    const resultatsBruts = (parsed as { resultats?: unknown }).resultats;
    if (typeof resultatsBruts !== "object" || resultatsBruts === null) return etatVide();

    const resultats: Record<string, EtapeResultat> = {};
    for (const [id, valeur] of Object.entries(resultatsBruts)) {
      if (estResultat(valeur)) resultats[id] = valeur;
    }
    return { version: PROGRESS_VERSION, resultats };
  } catch {
    // localStorage indisponible (mode privé strict) ou données corrompues :
    // on repart d'un état vide plutôt que de planter.
    return etatVide();
  }
}

function ecrireDansLocal(etat: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLE, JSON.stringify(etat));
  } catch {
    // Quota atteint ou stockage refusé : on ignore silencieusement.
  }
}

/** Implémentation localStorage de {@link ProgressStore}. */
export class LocalProgressStore implements ProgressStore {
  async charger(): Promise<ProgressState> {
    return lireDepuisLocal();
  }

  async enregistrer(resultat: EtapeResultat): Promise<ProgressState> {
    const etat = lireDepuisLocal();
    const suivant: ProgressState = {
      version: PROGRESS_VERSION,
      resultats: { ...etat.resultats, [resultat.etapeId]: resultat },
    };
    ecrireDansLocal(suivant);
    return suivant;
  }

  async reinitialiser(): Promise<ProgressState> {
    const vide = etatVide();
    ecrireDansLocal(vide);
    return vide;
  }
}

export const progressStore: ProgressStore = new LocalProgressStore();
