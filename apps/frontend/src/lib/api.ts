import { edenFetch, edenTreaty } from "@elysiajs/eden";
import type { App } from "@lani/backend";
import { OgVariant, type OpenGraphBody } from "@lani/backend/schema";

export type { OpenGraphBody };
export { OgVariant };

export const BACKEND_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:8787"
		: import.meta.env.VITE_BACKEND_URL || "http://localhost:8787";

export const eden = edenTreaty<App>(BACKEND_URL);
export const fetchEden = edenFetch<App>(BACKEND_URL);
