/// <reference types="vitest" />
import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";

import dotEnv from "dotenv";

dotEnv.config();

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		coverage: {
			exclude: ["node_modules/", "dist/", "api/"],
		},
	},
	plugins: [
		devServer({
			entry: "api/main.ts",
		}),
	],
});
