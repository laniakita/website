import type { Register } from "@tanstack/react-start";
import { createStartHandler, defaultStreamHandler, type RequestOptions } from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";

const startHandler = createStartHandler({
	handler: defaultStreamHandler,
	transformAssets: process.env.CDN_ORIGIN || "",
});

export default createServerEntry({
	fetch: async (request: Request, opts?: RequestOptions<Register> | undefined) => {
		const allowedOrigin = process.env.CDN_ORIGIN;

		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": allowedOrigin || "*",
					"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
				},
			});
		}

		const response = await startHandler(request, opts);

		if (allowedOrigin) {
			response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
		}

		return response;
	},
});
