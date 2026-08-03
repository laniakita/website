import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { playwright } from "@vitest/browser-playwright";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const dirname =
	import.meta.dirname || path.dirname(fileURLToPath(import.meta.url));

const isTestOrStorybook = process.env.STORYBOOK || process.env.VITEST;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const config = defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		!isTestOrStorybook && fumadocsMdx(),
		!isTestOrStorybook && devtools(),
		!isTestOrStorybook &&
			cloudflare({
				viteEnvironment: {
					name: "ssr",
					childEnvironments: ["rsc"],
				},
			}),
		tailwindcss(),
		!isTestOrStorybook &&
			tanstackStart({
				rsc: {
					enabled: true,
				},
			}),
		!isTestOrStorybook && rsc(),
		svgr(),
		viteReact(),
	],
	environments: {
		rsc: {
			optimizeDeps: {
				// Exclude TanStack Start packages from Vite's dependency optimization
				// to prevent issues with virtual imports (#tanstack-router-entry, etc.)
				// source: https://github.com/TanStack/router/issues/5795#issuecomment-3761285233
				exclude: [
					"@tanstack/start-server-core",
					"@tanstack/start-client-core",
					"@tanstack/start-storage-context",
					"@tanstack/react-start",
					"@tanstack/react-start/client",
					"@tanstack/react-start/server",
					"@tanstack/router-core",
					"@tanstack/history",
					"seroval",
					"seroval-plugins",
				],
			},
		},
	},
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({
						configDir: path.join(dirname, ".storybook"),
					}),
				],
				test: {
					name: "storybook",
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [
							{
								browser: "chromium",
							},
						],
					},
				},
			},
		],
	},
});
export default config;
