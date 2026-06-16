import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
    },

    rules: {
      /*
        Leidžiam komponentams turėti props be PropTypes.

        Mes nenaudojam PropTypes bibliotekos,
        todėl šita taisyklė tik trukdo.
      */
      "react/prop-types": "off",

      /*
        Naujesnis React Hooks lint kartais pažymi setState useEffect viduje.
        Mūsų atveju tai normalu, nes:
        - užpildom formą redagavimo duomenimis;
        - užkraunam dashboard duomenis;
        - fetchinam API duomenis.
      */
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);