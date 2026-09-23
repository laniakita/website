import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { worksSource } from "@/lib/collections/works";
import { OgVariant } from "@/lib/opengraph";
import { getSeoMeta } from "@/lib/utils/seo";

const NoiseShader01 = lazy(() => {
	if (import.meta.env.SSR) {
		return Promise.resolve({ default: () => <></> });
	}
	return import("@/components/canvas/r3f/shaders/noise/01/noise");
});

export const Route = createFileRoute("/works/shaders/noise/01")({
	ssr: false,
	loader: async () => {
		const shaderPieceInfo = worksSource.getPage(["shaders/noise/01"]);
		return {
			pageData: shaderPieceInfo?.data,
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
		<div className='relative h-dvh w-full'>
			<div className='absolute inset-0'>
				<Suspense fallback={<div className='flex size-full items-center justify-center'>Loading...</div>}>
					<NoiseShader01 />
				</Suspense>
			</div>
		</div>
	);
}
