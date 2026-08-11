"use client";
import { BlueskyEmbedCore } from "./mod";

export default function BlueskyEmbed({ postUrl }: { postUrl: string }) {
	return <BlueskyEmbedCore postUrl={postUrl} />;
}
