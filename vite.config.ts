import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@_types": "/src/types/index.d.ts",
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
});
