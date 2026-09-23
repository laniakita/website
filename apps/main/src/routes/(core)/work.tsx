import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { useMDXComponents } from "@/components/mdx";
import { OgVariant } from "@/lib/api";
import { pagesSource } from "@/lib/collections/pages";
import { worksSource } from "@/lib/collections/works";
import { getSeoMeta } from "@/lib/utils/seo";
import { WorkPageSkeleton } from "@/stories/skeletons/work-page-skeleton";
import { WorkPage } from "@/stories/work/work-page";

const getWorkPageData = createServerFn({ method: "GET" }).handler(async () => {
	const components = useMDXComponents();
	const page = pagesSource.getPage(["work"]);
	if (!page) {
		return null;
	}

	const PageMDX = page.data.body;
	const RenderablePageMDX = await renderServerComponent(<PageMDX components={components} />);

	const works = worksSource
		.getPages()
		.sort(
			(a, b) =>
				(b.data.lastModified ?? b.data.createdAt).valueOf() - (a.data.lastModified ?? a.data.createdAt).valueOf(),
		);

	// Map through works and render their MDX
	const renderableWorks = await Promise.all(
		works.map(async (work) => {
			const WorkMDX = work.data.body;

			const RenderableMDX = await renderServerComponent(
				<div className='prose-protocol-omega text-pretty prose-p:first:mt-0 prose-p:last:mb-0'>
					<WorkMDX components={components} />
				</div>,
			);

			return {
				id: work.data.id,
				title: work.data.title,
				source: work.data.source,
				type: work.data.type,
				active: work.data.active,
				createdAt: work.data.createdAt,
				lastModified: work.data.lastModified,
				tech: work.data.tech,
				links: work.data.links,
				featured_image: work.data.featured_image,
				RenderableMDX,
			};
		}),
	);

	return {
		pageData: {
			title: page.data.title,
			description: page.data.description,
			totalWorks: works.length,
		},
		RenderablePageMDX,
		renderableWorks,
	};
});

export const Route = createFileRoute("/(core)/work")({
	pendingComponent: WorkPageSkeleton,
	loader: async () => {
		const result = await getWorkPageData();
		if (!result) throw notFound();
		return result;
	},
	head: async ({ loaderData }) => ({
		meta: await getSeoMeta({
			title: loaderData?.pageData.title,
			description: loaderData?.pageData.description,
			ogParams: { variant: OgVariant.Static, title: loaderData?.pageData.title ?? "Work" },
			lastModified: new Date(__BUILD_DATE__),
		}),
	}),
	component: () => {
		const { pageData, RenderablePageMDX, renderableWorks } = Route.useLoaderData();

		return (
			<WorkPage
				title={pageData.title}
				totalWorks={pageData.totalWorks}
				description={RenderablePageMDX}
				works={renderableWorks}
			/>
		);
	},
});
