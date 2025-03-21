import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { replaceImportMetaUrl } from "./vite-plugins/replaceImportMetaUrl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), replaceImportMetaUrl()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
