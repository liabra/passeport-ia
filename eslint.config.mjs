import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 exporte des configs « flat » natives : on les étale
// directement (pas de FlatCompat).
const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "public/sw.js"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Interface entièrement en français : les apostrophes typographiques dans
      // le JSX sont volontaires et lisibles. On désactive cette règle anglo-centrée.
      "react/no-unescaped-entities": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Les scripts CLI écrivent légitimement sur la sortie standard.
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
];

export default eslintConfig;
