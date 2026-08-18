import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Design-ing-History-/",
  plugins: [react()],
  build: {
    outDir: "github-dist",
    emptyOutDir: true,
  },
});
