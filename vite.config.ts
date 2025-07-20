import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow connections from CodeSandbox preview domain
    allowedHosts: ["c7x5cj-5175.csb.app"],
  },
});
