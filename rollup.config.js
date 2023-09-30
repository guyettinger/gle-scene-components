import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import css from "rollup-plugin-import-css";
import copy from "rollup-plugin-copy";


const packageJson = require("./package.json");


export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
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
            terser(),
            copy({
                targets: [
                    { src: 'node_modules/cesium/Build/Cesium/*', dest: 'dist' },
                    { src: 'node_modules/cesium/Build/Cesium/Widgets/widgets.css', dest: 'dist' },
                    { src: 'node_modules/cesium/Build/Cesium/Widgets/Images/TimelineIcons.png', dest: 'dist/Images' }
                ],
                copyOnce: true
            }),
        ],
        external: ["react", "react-dom", "styled-components"],
    },
    {
        input: "src/index.ts",
        output: [{file: "dist/types.d.ts", format: "es"}],
        plugins: [dts.default()],
    },
];
