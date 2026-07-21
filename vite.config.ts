import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const format = mode === "cjs" ? "cjs" : "es";
  const outDir = format === "cjs" ? "dist/cjs" : "dist/esm";

  return {
    css: {
      modules: {
        generateScopedName: "ast-[name]-[hash]-[local]",
        localsConvention: "asIs",
      },
    },
    build: {
      outDir,
      emptyOutDir: format !== "cjs",
      lib: {
        entry: path.resolve(dirname, "src/main.ts"),
        formats: [format],
        fileName: () => "main.js",
        cssFileName: "main",
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          exports: "named",
        },
      },
    },
  };
});
