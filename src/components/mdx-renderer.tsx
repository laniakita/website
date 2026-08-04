"use client";
import Markdown from "markdown-to-jsx/react";
import { Link } from "./ui/link";

export default function GlobalMDXRenderer({ children }: { children: string }) {
	return (
		<Markdown
			options={{
				forceBlock: true,
				overrides: {
					a: Link,
				},
			}}
		>
			{children}
		</Markdown>
	);
}
