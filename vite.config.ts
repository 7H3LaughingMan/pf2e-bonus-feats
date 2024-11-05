import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import checker from "vite-plugin-checker";
import moduleJSON from "./static/module.json" with { type: "json" };
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    publicDir: "static",
    build: {
        emptyOutDir: false,
        sourcemap: true,
        lib: {
            name: moduleJSON.id,
            entry: "src/index.ts",
            formats: ["es"],
            fileName: moduleJSON.id,
        },
    },
    plugins: [
        checker({ typescript: true }),
        tsconfigPaths({ loose: true }),
        viteStaticCopy({
            targets: [
                { src: "CHANGELOG.md", dest: "." },
                { src: "LICENSE.md", dest: "." },
                { src: "README.md", dest: "." },
            ],
        }),
    ],
});
