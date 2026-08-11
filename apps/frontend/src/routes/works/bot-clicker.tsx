import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { HajClickerStoreProvider } from "@/components/canvas/r3f/bot-clicker/store";

// We use lazy to prevent server-side evaluation of Three.js code which requires window
const BotClickerScene = lazy(() => {
	if (import.meta.env.SSR) {
		return Promise.resolve({ default: () => <></> });
	}
	return import("@/components/canvas/r3f/bot-clicker/scene-main");
});

export const Route = createFileRoute("/works/bot-clicker")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Suspense fallback={<div className='flex h-dvh w-full items-center justify-center'>Loading Bot Clicker...</div>}>
			<HajClickerStoreProvider>
				<BotClickerScene isEmbed={false} />
			</HajClickerStoreProvider>
		</Suspense>
	);
}
