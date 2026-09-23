"use server";
import { createMiddleware } from "@tanstack/react-start";

export const AUTH_HEADER_AUTHORIZATION = "authorization";
export const AUTH_HEADER_CF_CONNECTING_IP = "cf-connecting-ip";
export const AUTH_HEADER_X_FORWARDED_FOR = "x-forwarded-for";
export const AUTH_HEADER_USER_AGENT = "user-agent";
export const AUTH_HEADER_CF_RAY = "cf-ray";
export const AUTH_BEARER_PREFIX = "Bearer ";
export const AUTH_ERROR_UNAUTHORIZED = "UNAUTHORIZED";

export interface ClientHeaders {
	[AUTH_HEADER_X_FORWARDED_FOR]?: string;
	[AUTH_HEADER_USER_AGENT]?: string;
	[AUTH_HEADER_CF_RAY]?: string;
}

/**
 * Middleware to add client context headers to the request.
 */
export const clientCtxMiddleware = createMiddleware().server(async ({ next, request }) => {
	const userIp = request.headers.get(AUTH_HEADER_CF_CONNECTING_IP) || request.headers.get(AUTH_HEADER_X_FORWARDED_FOR);
	const userAgent = request.headers.get(AUTH_HEADER_USER_AGENT);
	const cfRay = request.headers.get(AUTH_HEADER_CF_RAY);
	const url = request.url;

	const clientHeaders: ClientHeaders = {};
	if (userIp) {
		clientHeaders[AUTH_HEADER_X_FORWARDED_FOR] = userIp;
	}
	if (userAgent) {
		clientHeaders[AUTH_HEADER_USER_AGENT] = userAgent;
	}
	if (cfRay) {
		clientHeaders[AUTH_HEADER_CF_RAY] = cfRay;
	}

	return await next({
		context: { clientHeaders, url },
	});
});
