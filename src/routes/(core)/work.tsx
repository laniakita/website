import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { useMDXComponents } from "@/components/mdx";
import { pagesSource } from "@/lib/collections/pages";
import { worksSource } from "@/lib/collections/works";
import { getSeoMeta } from "@/lib/utils/seo";
import { WorkRoller } from "@/stories/work/work-roller";

const getWorkPageData = createServerFn({ method: "GET" }).handler(async () => {
	const components = useMDXComponents();
	const page = pagesSource.getPage(["work"]);
	if (!page) {
		return null;
	}

	const PageMDX = page.data.body;
	const RenderablePageMDX = await renderServerComponent(
		<PageMDX components={components} />,
	);

	const works = worksSource
		.getPages()
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

	// Map through works and render their MDX
	const renderableWorks = await Promise.all(
		works.map(async (work) => {
			const WorkMDX = work.data.body;

			return {
				id: work.data.id,
				title: work.data.title,
				source: work.data.source,
				url: work.data.url,
				type: work.data.type,
				active: work.data.active,
				date: work.data.date,
				tech: work.data.tech,
				links: work.data.links,
				featured_image: work.data.featured_image,
				RenderableMDX: <WorkMDX components={components} />,
			};
		}),
	);

	const RenderableWorkRoller = await renderServerComponent(
		<WorkRoller works={renderableWorks} />,
	);

	return {
		pageData: {
			title: page.data.title,
			description: page.data.description,
		},
		RenderablePageMDX,
		RenderableWorkRoller,
	};
});

import { InfoLayoutSkeleton } from "@/stories/skeletons/info-layout-skeleton";

export const Route = createFileRoute("/(core)/work")({
	loader: async () => {
		const result = await getWorkPageData();
		if (!result) throw notFound();
		return result;
	},
	head: ({ loaderData }) => ({
		meta: getSeoMeta({
			title: loaderData?.pageData.title,
			description: loaderData?.pageData.description,
			image: "/api/og/static/work",
		}),
	}),
	component: () => {
		const { pageData, RenderablePageMDX, RenderableWorkRoller } =
			Route.useLoaderData();

		return (
			<main className="common-padding w-full max-w-3xl m-auto pt-10">
				<div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full">
					<div className="flex w-full flex-col gap-4 rounded-md border border-ctp-surface0 p-8 dark:border-ctp-base motion-safe:simple-color-trans dark:bg-ctp-midnight bg-ctp-base shadow-sm">
						<div>
							<h1 className="text-3xl font-black md:text-4xl">
								{pageData.title}
							</h1>
						</div>
						<div className="h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base" />
						<div className="prose-protocol-omega w-full max-w-sm prose-p:my-0">
							{RenderablePageMDX}
						</div>
					</div>

					{RenderableWorkRoller}
				</div>
			</main>
		);
	},
	pendingComponent: InfoLayoutSkeleton,
});
