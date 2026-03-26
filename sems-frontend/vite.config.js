import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Student Evaluation Management System",
        short_name: "SEMS",
        description: "Manage student evaluations and progress",
        theme_color: "#1e3a8a", // blue-900
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "vite.svg", // Placeholder, ideally replaced with 192x192.png
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "vite.svg", // Placeholder, ideally replaced with 512x512.png
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
