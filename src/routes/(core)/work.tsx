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
	const RenderablePageMDX = await renderServerComponent(<PageMDX components={components} />);

	const works = worksSource.getPages().sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

	// Map through works and render their MDX
	const renderableWorks = await Promise.all(
		works.map(async (work) => {
			const WorkMDX = work.data.body;

			return {
				id: work.data.id,
				title: work.data.title,
				source: work.data.source,
				type: work.data.type,
				active: work.data.active,
				date: work.data.date,
				tech: work.data.tech,
				links: work.data.links,
				featured_image: work.data.featured_image,
				RenderableMDX: (
					<div className='prose-protocol-omega text-pretty prose-p:first:mt-0 prose-p:last:mb-0'>
						<WorkMDX components={components} />
					</div>
				),
			};
		}),
	);

	const RenderableWorkRoller = await renderServerComponent(<WorkRoller works={renderableWorks} />);

	return {
		pageData: {
			title: page.data.title,
			description: page.data.description,
		},
		RenderablePageMDX,
		RenderableWorkRoller,
	};
});

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
			image: "/opengraph/static/work",
		}),
	}),
	component: () => {
		const { pageData, RenderablePageMDX, RenderableWorkRoller } = Route.useLoaderData();

		return (
			<main className='common-padding m-auto w-full max-w-7xl pt-10'>
				<div className='flex w-full flex-col items-center justify-center gap-4 md:gap-6'>
					<div className='motion-safe:simple-color-trans flex w-full flex-col gap-4 rounded-md border border-ctp-surface0 bg-ctp-base p-8 shadow-sm dark:border-ctp-base dark:bg-ctp-midnight'>
						<div>
							<h1 className='font-black text-3xl md:text-4xl'>{pageData.title}</h1>
						</div>
						<div className='h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base' />
						<div className='prose-protocol-omega prose-p:my-0 w-full max-w-xl text-lg'>{RenderablePageMDX}</div>
					</div>

					{RenderableWorkRoller}
				</div>
			</main>
		);
	},
});
