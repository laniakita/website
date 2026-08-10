import { edenTreaty } from "@elysiajs/eden";
import type { App } from "@lani/backend";

const BACKEND_URL = process.env.VITE_BACKEND_URL || "http://localhost:8787";

export const eden = edenTreaty<App>(BACKEND_URL);
