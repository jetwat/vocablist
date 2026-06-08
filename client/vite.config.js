// vite.config.js
//
// proxy /api → server:5000 ตอน dev
// ทำให้ fetch("/api/v1/...") ไม่ต้องใส่ full URL
// และแก้ CORS problem ตอน dev ด้วย (same origin)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
