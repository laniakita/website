import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { setResponseHeader } from "@tanstack/react-start/server";
import { useMDXComponents } from "@/components/mdx";
import { OgVariant } from "@/lib/api";
import { pagesSource } from "@/lib/collections/pages";
import { getSeoMeta } from "@/lib/utils/seo";
import { InfoContentSkeleton } from "@/stories/skeletons/info-layout-skeleton";

const getInfoPage = createServerFn({ method: "GET" })
	.validator((splat: string) => splat)
	.handler(async ({ data: splat }) => {
		setResponseHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate=31536000");

		const slugs = splat.split("/");
		const page = pagesSource.getPage(slugs);
		const components = useMDXComponents();

		if (!page) {
			return null;
		}

		const MDX = page.data.body;
		const RenderableMDX = await renderServerComponent(<MDX components={components} />);

		return {
			pageData: {
				title: page.data.title,
				description: page.data.description,
				createdAt: page.data.createdAt,
				lastModified: page.data.lastModified,
			},
			RenderableMDX,
		};
	});

export const Route = createFileRoute("/(core)/_info/$")({
	loader: async ({ params }) => {
		if (!params._splat) {
			throw notFound();
		}
		const result = await getInfoPage({ data: params._splat });
		if (!result) {
			throw notFound();
		}
		return result;
	},
	head: async ({ loaderData, params }) => ({
		meta: await getSeoMeta({
			title: loaderData?.pageData.title,
			description: loaderData?.pageData.description,
			ogParams:
				params._splat === "credits"
					? {
							variant: OgVariant.Dynamic,
							title: loaderData?.pageData.title ?? "Info",
							prefix: "Credits",
						}
					: {
							variant: OgVariant.Static,
							title: loaderData?.pageData.title ?? "Info",
						},
			lastModified: new Date(
				loaderData?.pageData.lastModified ?? loaderData?.pageData.createdAt ?? __BUILD_DATE__,
			),
		}),
	}),
	component: () => {
		const { RenderableMDX } = Route.useLoaderData();
		return <>{RenderableMDX}</>;
	},
	pendingComponent: InfoContentSkeleton,
});
