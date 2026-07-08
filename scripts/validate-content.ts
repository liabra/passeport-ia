/**
 * Valide tout le contenu de /content avec les schémas zod.
 * Exécuté en CI (`npm run validate:content`) et localement avant commit.
 * Sort en code 1 au premier fichier invalide.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { activiteSchema, parcoursSchema } from "../src/content/schema";

const racine = fileURLToPath(new URL("..", import.meta.url));
const dossierContenu = join(racine, "content");
const dossierActivites = join(dossierContenu, "activites");

let erreurs = 0;

function lireJson(chemin: string): unknown {
  return JSON.parse(readFileSync(chemin, "utf8"));
}

function signaler(fichier: string, messages: string[]): void {
  erreurs += messages.length;
  console.error(`\n✗ ${fichier}`);
  for (const m of messages) console.error(`   - ${m}`);
}

// 1) Parcours
const parcoursRaw = lireJson(join(dossierContenu, "parcours.json"));
const parcours = parcoursSchema.safeParse(parcoursRaw);
if (!parcours.success) {
  signaler(
    "content/parcours.json",
    parcours.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
  );
}

// 2) Activités
const fichiersActivites = readdirSync(dossierActivites).filter((f) => f.endsWith(".json"));
const idsVus = new Set<string>();
const typesParId = new Map<string, string>();

for (const fichier of fichiersActivites) {
  const raw = lireJson(join(dossierActivites, fichier));
  const res = activiteSchema.safeParse(raw);
  if (!res.success) {
    signaler(
      `content/activites/${fichier}`,
      res.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    );
    continue;
  }
  const { id, type } = res.data;
  if (idsVus.has(id)) signaler(`content/activites/${fichier}`, [`id « ${id} » en double`]);
  idsVus.add(id);
  typesParId.set(id, type);
}

// 3) Cohérence parcours ↔ activités (quand l'activité existe déjà)
if (parcours.success) {
  for (const territoire of parcours.data.territoires) {
    for (const etape of territoire.etapes) {
      const type = typesParId.get(etape.activiteId);
      if (type && type !== etape.activiteType) {
        signaler("content/parcours.json", [
          `étape « ${etape.id} » : activiteType « ${etape.activiteType} » ≠ type réel « ${type} » de l'activité`,
        ]);
      }
    }
  }
}

if (erreurs > 0) {
  console.error(`\nContenu invalide : ${erreurs} problème(s).`);
  process.exit(1);
}

console.log(
  `Contenu valide : parcours OK, ${fichiersActivites.length} activité(s) validée(s).`,
);
