import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Isso pode retornar um objeto ou um array.
  // Não tem problema, o .flat() no final vai cuidar disso.
  tailwindCanonicalClasses.configs["flat/recommended"],

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": "warn",
      "simple-import-sort/imports": "warn",
    },
  },
];

// O .flat(Infinity) transforma qualquer array aninhado num array perfeitamente plano.
// O .filter(Boolean) remove configurações nulas ou undefined para evitar erros internos do ESLint.
export default eslintConfig.flat(Infinity).filter(Boolean);
