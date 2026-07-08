import perroquetEchos from "../../content/activites/perroquet-echos.json";
import intrusTourEiffel from "../../content/activites/intrus-tour-eiffel.json";
import renardFruits from "../../content/activites/renard-fruits.json";

/**
 * Registre des activités.
 *
 * Pour ajouter une activité : déposer son JSON dans `/content/activites`,
 * l'importer ici, et l'ajouter au tableau. Les fichiers sont validés par zod
 * à l'import (voir `./index.ts`) ET par `npm run validate:content`.
 *
 * Une étape du parcours qui référence un `activiteId` absent de ce registre
 * affiche automatiquement l'écran « en cours de fabrication ».
 */
export const activitesRaw: unknown[] = [perroquetEchos, intrusTourEiffel, renardFruits];
