import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import css from "rollup-plugin-import-css";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
                interop: "auto",
                name: "gle-scene-components"
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({tsconfig: "./tsconfig.json"}),
            css(),
            terser()
        ],
        external: ["react", "react-dom", "styled-components"],
    },
    {
        input: "src/index.ts",
        output: [{file: "dist/types.d.ts", format: "esm"}],
        plugins: [dts.default()],
    },
];
