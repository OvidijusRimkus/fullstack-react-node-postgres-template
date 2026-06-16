import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/*
  Vite config.

  Čia prijungiam:
  - React pluginą;
  - Tailwind CSS pluginą.
*/

export default defineConfig({
  plugins: [react(), tailwindcss()],
});