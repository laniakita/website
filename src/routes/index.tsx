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
	const res = blogSource.getPages();

	const Renderable = await renderServerComponent(<PostRoller posts={res} />);
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
