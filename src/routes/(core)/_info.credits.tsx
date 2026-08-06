import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { useMDXComponents } from "@/components/mdx";
import { pagesSource } from "@/lib/collections/pages";
import { getSeoMeta } from "@/lib/utils/seo";

const getCreditsPage = createServerFn({ method: "GET" }).handler(async () => {
	const page = pagesSource.getPage(["credits"]);
	const components = useMDXComponents();
	if (!page) {
		return null;
	}

	const MDX = page.data.body;

	const RenderableMDX = await renderServerComponent(
		<MDX components={components} />,
	);

	return {
		pageData: {
			title: page.data.title,
			description: page.data.description,
		},
		RenderableMDX,
	};
});

import { InfoLayoutSkeleton } from "@/stories/skeletons/info-layout-skeleton";

export const Route = createFileRoute("/(core)/_info/credits")({
	loader: async () => {
		const result = await getCreditsPage();
		if (!result) throw notFound();
		return result;
	},
	head: ({ loaderData }) => ({
		meta: getSeoMeta({
			title: loaderData?.pageData.title,
			description: loaderData?.pageData.description,
			image: "/api/og/static/credits",
		}),
	}),
	component: () => {
		const { RenderableMDX } = Route.useLoaderData();
		return RenderableMDX;
	},
	pendingComponent: InfoLayoutSkeleton,
});
