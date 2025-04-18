/// <reference types="vitest" />
import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";

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
			entry: "src/main.ts",
		}),
	],
});
