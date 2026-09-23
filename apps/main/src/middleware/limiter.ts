import { env } from "cloudflare:workers";
import { createMiddleware } from "@tanstack/react-start";
import { AUTH_HEADER_X_FORWARDED_FOR, clientCtxMiddleware } from "./client";

export const openGraphLimiterMiddleware = createMiddleware()
	.middleware([clientCtxMiddleware])
	.server(async ({ next, context }) => {
		if (env?.RATE_LIMITER_OG) {
			const ip = context.clientHeaders[AUTH_HEADER_X_FORWARDED_FOR] ?? "127.0.0.1";
			const { success } = await env.RATE_LIMITER_OG.limit({ key: `og:${ip}` });
			if (!success) {
				return new Response("Too Many Requests", {
					status: 429,
					headers: {
						"Retry-After": "60",
						"Content-Type": "text/plain",
					},
				});
			}
		}
		return await next({
			context,
		});
	});
