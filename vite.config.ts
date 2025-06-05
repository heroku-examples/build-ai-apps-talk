import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [envOnlyMacros(), tsconfigPaths(), reactRouter()],
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
});
