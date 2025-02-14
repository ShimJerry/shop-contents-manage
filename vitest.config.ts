import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@_types": "/src/types/index.d.ts",
    },
  },
  test: {
    name: "shop-cms",
    globals: true,
    dir: "src/tests",
    reporters: "basic",
    coverage: {
      include: ["src/**/"],
      reporter: ["text", "json", "text-summary"],
      reportsDirectory: "./coverage/",
    },
  },
});
