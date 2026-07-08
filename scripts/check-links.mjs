/**
 * Vérifie que toutes les URL externes présentes dans /content répondent en 200.
 * Exécuté par un job CI séparé (hebdomadaire + manuel) : le contenu peut
 * référencer des « ponts vers le réel » qui pourrissent avec le temps.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const racine = fileURLToPath(new URL("..", import.meta.url));
const dossierContenu = join(racine, "content");

/** Parcourt récursivement un dossier et renvoie les chemins des .json. */
function fichiersJson(dossier) {
  const sortie = [];
  for (const entree of readdirSync(dossier)) {
    const chemin = join(dossier, entree);
    if (statSync(chemin).isDirectory()) sortie.push(...fichiersJson(chemin));
    else if (entree.endsWith(".json")) sortie.push(chemin);
  }
  return sortie;
}

/** Collecte récursivement toute chaîne http(s) d'une valeur JSON. */
function collecterUrls(valeur, acc) {
  if (typeof valeur === "string") {
    if (/^https?:\/\//i.test(valeur)) acc.add(valeur);
  } else if (Array.isArray(valeur)) {
    for (const v of valeur) collecterUrls(v, acc);
  } else if (valeur && typeof valeur === "object") {
    for (const v of Object.values(valeur)) collecterUrls(v, acc);
  }
  return acc;
}

const urls = new Set();
for (const fichier of fichiersJson(dossierContenu)) {
  collecterUrls(JSON.parse(readFileSync(fichier, "utf8")), urls);
}

if (urls.size === 0) {
  console.log("Aucune URL externe dans /content.");
  process.exit(0);
}

async function verifier(url) {
  const options = {
    redirect: "follow",
    headers: { "User-Agent": "PasseportIA-LinkCheck/1.0" },
    signal: AbortSignal.timeout(15000),
  };
  try {
    let r = await fetch(url, { method: "HEAD", ...options });
    // Certains serveurs refusent HEAD : on retente en GET.
    if (r.status === 405 || r.status === 501) r = await fetch(url, { method: "GET", ...options });
    return { url, status: r.status, ok: r.status === 200 };
  } catch (e) {
    return { url, status: 0, ok: false, erreur: String(e) };
  }
}

const resultats = await Promise.all([...urls].map(verifier));
let echecs = 0;
for (const r of resultats) {
  if (r.ok) {
    console.log(`OK   ${r.status}  ${r.url}`);
  } else {
    echecs += 1;
    console.error(`FAIL ${r.status}  ${r.url}${r.erreur ? `  (${r.erreur})` : ""}`);
  }
}

if (echecs > 0) {
  console.error(`\n${echecs} lien(s) cassé(s) sur ${urls.size}.`);
  process.exit(1);
}
console.log(`\n${urls.size} lien(s) vérifié(s), tous en 200.`);
