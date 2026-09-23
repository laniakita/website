"use client";

import { lazy, Suspense } from "react";

const BlueskyEmbedCore = lazy(async () => {
	if (import.meta.env.SSR) {
		return Promise.resolve({ default: () => <></> });
	}
	return import("./mod").then((mod) => ({ default: mod.BlueskyEmbedCore }));
});

export default function BlueskyEmbed({ postUrl }: { postUrl: string }) {
	return (
		<Suspense fallback={null}>
			<BlueskyEmbedCore postUrl={postUrl} />
		</Suspense>
	);
}
