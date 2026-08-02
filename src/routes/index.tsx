import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { blogSource } from "@/lib/collections/blog";
import { categoriesSource } from "@/lib/collections/categories";
import { tagsSource } from "@/lib/collections/tags";

function PostRoller({
	posts,
}: {
	posts: ReturnType<typeof blogSource.getPages>;
}) {
	return (
		<div>
			{posts.map((post) => (
				<div key={post.data.url}>{post.data.headline}</div>
			))}
		</div>
	);
}

const getPosts = createServerFn().handler(async () => {
	const res = blogSource.getPages().map((post) => {
		const categoriesRes =
			post.data.catSlugs &&
			(post.data.catSlugs
				.map((ref) => {
					const found = categoriesSource.getPage([ref]);
					if (found) {
						return {
							title: found.data.title,
							slug: found.data.slug,
							url: found.data.url,
							type: found.data.type,
						};
					} else {
						return undefined;
					}
				})
				.filter((el) => el)
				.sort((a, b) => a?.title.localeCompare(b?.title ?? "") ?? 0) as {
				title: string;
				url: string;
				type: string;
			}[]);

		if (categoriesRes) {
			post.data.categories = categoriesRes;
			delete post.data.catSlugs;
		}

		const tagsRes =
			post.data.tagSlugs &&
			(post.data.tagSlugs
				.map((ref) => {
					const foundTags = tagsSource.getPage([ref]);
					if (foundTags) {
						return {
							title: foundTags.data.title,
							slug: foundTags.data.slug,
							url: foundTags.data.url,
							type: foundTags.data.type,
						};
					} else {
						return undefined;
					}
				})
				.filter((el) => el)
				.sort((a, b) => a?.title.localeCompare(b?.title ?? "") ?? 0) as {
				title: string;
				url: string;
				type: string;
			}[]);

		if (tagsRes) {
			post.data.tags = tagsRes;
			delete post.data.tagSlugs;
		}

		return post;
	});

	const Renderable = await renderServerComponent(
		<PostRoller posts={res as ReturnType<typeof blogSource.getPages>} />,
	);
	return { Renderable };
});

export const Route = createFileRoute("/")({
	loader: async () => {
		//const { Renderable } = await getGreeting();
		//return { Greeting: Renderable };
		const { Renderable } = await getPosts();
		return { PostRoller: Renderable };
	},
	component: App,
});

function App() {
	//const { Greeting } = Route.useLoaderData();
	const { PostRoller } = Route.useLoaderData();

	return (
		<main>
			<div>home</div>
			<>{PostRoller}</>
		</main>
	);
}
