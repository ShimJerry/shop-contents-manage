import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "shop-cms",
    globals: true,
    dir: "tests",
    reporters: "basic",
    coverage: {
      include: ["src/**/"],
      reporter: ["text", "json", "text-summary"],
      reportsDirectory: "./coverage/",
    },
  },
});
