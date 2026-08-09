"use client";
import Markdown from "markdown-to-jsx/react";
import Anchors from "./mdx/anchor-tags";

export default function GlobalMDXRenderer({ children }: { children: string }) {
	return (
		<Markdown
			options={{
				forceBlock: true,
				overrides: {
					a: Anchors,
				},
			}}
		>
			{children}
		</Markdown>
	);
}
