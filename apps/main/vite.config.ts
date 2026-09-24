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
import glsl from "vite-plugin-glsl";
import svgr from "vite-plugin-svgr";

const dirname = import.meta.dirname || path.dirname(fileURLToPath(import.meta.url));

const isTestOrStorybook = process.env.STORYBOOK || process.env.VITEST;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const config = defineConfig({
	define: {
		__BUILD_DATE__: JSON.stringify(new Date().toISOString()),
	},
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
				inspectorPort: 9230,
			}),
		tailwindcss(),
		!isTestOrStorybook &&
			tanstackStart({
				rsc: {
					enabled: true,
				},
				prerender: {
					enabled: true,
					crawlLinks: true,
					filter: ({ path }) => !path.startsWith("/works") && !path.startsWith("/work/"),
					autoStaticPathsDiscovery: true,
				},
			}),
		!isTestOrStorybook && rsc(),
		svgr(),
		viteReact(),
		glsl(),
	],
	optimizeDeps: {
		include: ["storybook/viewport"],
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
						viewport: {
							width: 1280,
							height: 800,
						},
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
