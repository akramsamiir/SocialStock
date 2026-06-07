import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      {
        find: "@workspace/ui/globals.css",
        replacement: path.resolve(__dirname, "../../packages/ui/src/styles/globals.css"),
      },
      {
        find: /^@workspace\/ui\/(.*)/,
        replacement: path.resolve(__dirname, "../../packages/ui/src/$1"),
      },
    ],
  },
})
