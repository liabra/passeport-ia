"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker pour le fonctionnement hors-ligne.
 * Contrainte du projet : PC de bibliothèques et connexions faibles — l'app et
 * tout le contenu jouable doivent fonctionner sans réseau après la 1re visite.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const enregistrer = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Enregistrement impossible (ex. contexte non sécurisé) : l'app
        // fonctionne quand même en ligne, on n'interrompt rien.
      });
    };
    window.addEventListener("load", enregistrer);
    return () => window.removeEventListener("load", enregistrer);
  }, []);

  return null;
}
