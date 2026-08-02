import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { projects } from "$/.source/server";

export const projectsSource = loader({
	baseUrl: "/projects",
	source: toFumadocsSource(projects, []),
});
