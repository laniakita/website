import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { compareDesc } from "date-fns";
import { lazy, Suspense } from "react";
import { BlogPostRoller } from "@/components/blog/post-roller";
import GlobalMDXRenderer from "@/components/mdx-renderer";
import { BlogSidebar } from "@/components/sidebar";
import { SidebarInfo } from "@/components/sidebar/info";
import { blogSource } from "@/lib/collections/blog";
import { categoriesSource } from "@/lib/collections/categories";
import { tagsSource } from "@/lib/collections/tags";
import type { CatTag } from "@/stories/blog/cat-tag-roller";
import type { PostPreviewProps } from "@/stories/blog/post-preview";

const NoiseShader01 = lazy(() => {
	return import("@/components/canvas/r3f/shaders/noise/01/noise");
});

const getPosts = createServerFn().handler(async () => {
	const res = blogSource
		.getPages()
		.sort((a, b) =>
			compareDesc(new Date(a.data.lastModified ?? a.data.createdAt), new Date(b.data.lastModified ?? b.data.createdAt)),
		);
	const posts = res.map((meta) => {
		const categories = meta.data.categories as CatTag[];
		const tags = meta.data.tags as CatTag[];
		return {
			url: meta.data.url,
			headline: meta.data.headline,
			subheadline: meta.data.subheadline,
			description: <GlobalMDXRenderer>{meta.data.description}</GlobalMDXRenderer>,
			createdAt: meta.data.createdAt,
			lastModified: meta.data.lastModified,
			featured_image: meta.data.featured_image,
			categories,
			tags,
		} satisfies PostPreviewProps;
	});

	const Renderable = await renderServerComponent(<BlogPostRoller posts={posts} />);
	return { Renderable };
});

const getBlogMeta = createServerFn().handler(async () => {
	const categoriesRes = categoriesSource.getPages().sort((a, b) => a.data.title.localeCompare(b.data.title));
	const tagsRes = tagsSource.getPages().sort((a, b) => a.data.title.localeCompare(b.data.title));

	const categories = categoriesRes.map((meta) => {
		return {
			title: meta.data.title,
			url: meta.data.url,
		};
	});
	const tags = tagsRes.map((meta) => {
		return {
			title: meta.data.title,
			url: meta.data.url,
		};
	});
	return { categories, tags };
});

const getAbout = createServerFn().handler(async () => {
	const res = pagesSource.getPage(["about"]);
	const description = descriptionHelper(await res?.data.getText("processed"), "/about");
	console.log(description);
	const RenderableAbout = await renderServerComponent(
		<GlobalMDXRenderer>{description ?? "Software Engineer"}</GlobalMDXRenderer>,
	);
	return {
		RenderableAbout: RenderableAbout,
	};
});

import { PostRollerSkeleton } from "@/stories/skeletons/post-roller-skeleton";
import { SidebarSkeleton } from "@/stories/skeletons/sidebar-skeleton";
import { descriptionHelper } from "$/schema/description-helper";
import { pagesSource } from "$/src/lib/collections/pages";

export const Route = createFileRoute("/(core)/")({
	loader: async () => {
		const { Renderable } = await getPosts();
		const { categories, tags } = await getBlogMeta();
		const { RenderableAbout } = await getAbout();
		return { PostRoller: Renderable, meta: { categories, tags }, RenderableAbout };
	},

	component: App,
	pendingComponent: () => (
		<div className='m-auto flex size-full max-w-7xl flex-row gap-6 p-2 md:p-10'>
			<main className='simple-color-trans m-auto flex w-full flex-col justify-center gap-4 px-page-common pt-blog md:flex-row md:gap-6'>
				<div className='w-full'>
					<PostRollerSkeleton />
				</div>
			</main>
			<div className='hidden md:flex md:w-full md:max-w-xs lg:max-w-sm'>
				<SidebarSkeleton />
			</div>
		</div>
	),
});

function App() {
	const { PostRoller, meta, RenderableAbout } = Route.useLoaderData();

	return (
		<Suspense
			fallback={
				<div className='m-auto flex size-full max-w-7xl flex-row gap-6 p-2 md:p-10'>
					<main className='simple-color-trans m-auto flex w-full flex-col justify-center gap-4 px-page-common pt-blog md:flex-row md:gap-6'>
						<div className='w-full'>
							<PostRollerSkeleton />
						</div>
					</main>
					<div className='hidden md:flex md:w-full md:max-w-xs lg:max-w-sm'>
						<SidebarSkeleton />
					</div>
				</div>
			}
		>
			<div>
				<header className='@container/header relative -mt-12 flex h-[40dvh] items-center justify-center'>
					<div className='absolute inset-0'>
						<NoiseShader01 />
					</div>
					<div className='relative'>
						<div className='flex flex-col items-center rounded-md border border-primary bg-background/50 px-4 backdrop-blur-md'>
							<div>
								<span className='font-mono @md/header:text-2xs text-3xs text-primary uppercase tracking-widest'>
									Founder | Technologist
								</span>
								<h1 className='font-black font-heading @2xl/header:text-8xl @4xl/header:text-9xl @sm/header:text-6xl @xl/header:text-7xl text-5xl uppercase leading-[0.8] tracking-tighter'>
									Lani Akita
								</h1>
							</div>
							<div>
								<p>Thoughts from a Futurist.</p>
							</div>
						</div>
					</div>
				</header>
				<div className='m-auto flex size-full max-w-7xl flex-row gap-6 p-2 md:p-10'>
					<main className='simple-color-trans m-auto flex flex-col justify-center gap-4 px-page-common pt-blog md:flex-row md:gap-6'>
						<SidebarInfo className='md:hidden' categories={meta.categories} tags={meta.tags} />
						{PostRoller}
					</main>
					<div className='hidden md:flex md:w-full md:max-w-xs lg:max-w-sm'>
						<BlogSidebar categories={meta.categories} tags={meta.tags} />
					</div>
				</div>
			</div>
		</Suspense>
	);
}
