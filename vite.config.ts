import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const replaceReactRouterLocalhostFallback = () => ({
  name: "replace-react-router-localhost-fallback",
  enforce: "pre" as const,
  transform(source: string, id: string) {
    if (!id.includes("/node_modules/react-router/dist/")) return null;

    const code = source.replaceAll("http://localhost", "https://router.invalid");
    return code === source ? null : { code, map: null };
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [replaceReactRouterLocalhostFallback(), react(), tailwindcss()],
});
