import { OgVariant } from "@lani/backend/schema";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { HajClickerStoreProvider } from "@/components/canvas/r3f/bot-clicker/store";
import { worksSource } from "@/lib/collections/works";
import { getSeoMeta } from "@/lib/utils/seo";

// We use lazy to prevent server-side evaluation of Three.js code which requires window
const BotClickerScene = lazy(() => {
	if (import.meta.env.SSR) {
		return Promise.resolve({ default: () => <></> });
	}
	return import("@/components/canvas/r3f/bot-clicker/scene-main");
});

export const Route = createFileRoute("/works/bot-clicker")({
	ssr: false,
	loader: async () => {
		const botClickerInfo = worksSource.getPage(["bot-clicker"]);
		return {
			pageData: botClickerInfo?.data,
		};
	},
	head: async ({ loaderData }) => ({
		meta: await getSeoMeta({
			title: loaderData?.pageData?.title,
			description: loaderData?.pageData?.description,
			ogParams: {
				imageUrl: loaderData?.pageData?.featured_image?.src ?? "",
				variant: OgVariant.Image,
			},
			imageAlt: loaderData?.pageData?.altText,
			lastModified: new Date(loaderData?.pageData?.lastModified ?? loaderData?.pageData?.createdAt ?? __BUILD_DATE__),
		}),
	}),
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
