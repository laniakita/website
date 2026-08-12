import html from "@elysia/html";
import { bearer } from "@elysiajs/bearer";
import { openapi } from "@elysiajs/openapi";
import { toJsonSchema } from "@valibot/to-json-schema";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { imageGenerator } from "./opengraph/image-generator";
import { OpenGraphBodySchema, OpenGraphHeaderSchema } from "./schema";

export const app = new Elysia({ adapter: CloudflareAdapter })
	.use(html())
	.use(bearer())
	.use(
		openapi({
			mapJsonSchema: {
				valibot: toJsonSchema,
			},
			documentation: {
				info: {
					title: "Lani API",
					version: "1.0.0",
				},
				tags: [{ name: "OpenGraph", description: "OpenGraph image generation endpoints" }],
			},
		}),
	)
	.group("/api/v1", (app) =>
		app.group("/opengraph", (app) =>
			app.post(
				"",
				async (context) => {
					const { body, request } = context;
					const env = (request as unknown as { env: Env }).env;
					const twitter = body.twitter;
					const size = {
						width: twitter ? 1600 : 1200,
						height: twitter ? 900 : 630,
					};
					const baseUrl = new URL(request.url).origin;
					return await imageGenerator({ env, baseUrl, body, size });
				},
				{
					beforeHandle(context) {
						const { bearer, set, request } = context;
						const env = (request as unknown as { env: Env }).env;
						const expectedToken = env?.OG_AUTH_TOKEN;
						if (!bearer || bearer !== expectedToken) {
							set.status = 401;
							return { error: "Unauthorized" };
						}
					},
					body: OpenGraphBodySchema,
					headers: OpenGraphHeaderSchema,
					detail: {
						tags: ["OpenGraph"],
						summary: "Generate an OpenGraph image",
					},
				},
			),
		),
	)
	.compile();

export type App = typeof app;

export default {
	fetch(request: Request, env: Env, _ctx: ExecutionContext) {
		(request as unknown as { env: Env }).env = env;
		return app.fetch(request);
	},
};
