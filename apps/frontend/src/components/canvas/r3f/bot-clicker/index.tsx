import { lazy, Suspense } from "react";
import { HajClickerStoreProvider } from "./store";

// We use lazy to prevent server-side evaluation of Three.js code which requires window
const BotClickerScene = lazy(() => import("./scene-main"));

export default function BotClicker(props: { isEmbed?: boolean }) {
	return (
		<Suspense fallback={<div className='flex h-dvh w-full items-center justify-center'>Loading Bot Clicker...</div>}>
			<HajClickerStoreProvider>
				<BotClickerScene isEmbed={props.isEmbed} />
			</HajClickerStoreProvider>
		</Suspense>
	);
}
