import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    environment: "jsdom",
    globals: true,
    maxWorkers: 4,
    setupFiles: ["src/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["lcov", "text"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "**/index.ts",
        "**/interface.ts",
        "**/main.ts",
        "**/__dummy__/**",
        "**/node_modules/**",
        "**/*.stories.*",
        "**/*.test.*",
      ],
    },
  },
});
