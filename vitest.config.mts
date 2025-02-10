import { defineConfig } from "vitest/config.d.ts";

export default defineConfig({
  test: {
    name: "shop-cms",
    globals: true,
    dir: "tests",
    reporters: "basic",
    coverage: {
      include: ["src/**/"],
      reporter: ["text", "json", "html", "text-summary"],
      reportsDirectory: "./coverage/",
    },
  },
});
