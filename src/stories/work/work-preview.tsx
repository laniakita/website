import type * as React from "react";
import { CorePreview } from "@/stories/core/core-preview";

export interface WorkPreviewProps {
	/** Unique identifier */
	id: string;
	/** Title of the work */
	title: string;
	/** External source URL */
	source?: string;
	/** Internal fallback URL */
	url: string;
	/** Project or client work */
	type?: string;
	/** Is the link active/valid? */
	active: boolean;
	/** Date of work */
	date: Date | string;
	/** Optional cover image */
	featured_image?: {
		src: string;
		localHash: string;
		altText?: string;
		imgData?: {
			css: string;
			height: number;
			width: number;
		};
	};
	/** Array of technologies used */
	tech: string[];
	/** Additional related links */
	links?: Array<{ label: string; url: string }>;
	/** The rendered MDX description/body */
	RenderableMDX: React.ReactNode;
}

function formatDate(date: Date | string) {
	const d = new Date(date);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(d);
}

/**
 * A card component that previews a portfolio work item, displaying its featured image,
 * title, date range, description, and technologies used.
 */
export function WorkPreview(data: WorkPreviewProps) {
	const targetUrl = data.source || data.url;
	const isExternal = !!data.source;

	return (
		<CorePreview
			url={targetUrl}
			isExternal={isExternal}
			featured_image={data.featured_image}
			headline={
				<span className="relative">
					{data.title}
					{data.active && (
						<span className="absolute bottom-1 ml-px icon-[ph--arrow-up-right-bold] text-xl" />
					)}
				</span>
			}
			meta={
				<div className="flex flex-wrap gap-x-2 font-mono text-sm">
					<p className="flex w-fit flex-wrap gap-x-2 rounded-full">
						<span>{formatDate(data.date)}</span>
					</p>
				</div>
			}
			footer={
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap gap-[1ch]">
						{data.tech.map((tag, idx) => (
							<p
								key={`tech-${tag}`}
								className="w-fit font-mono text-sm font-semibold"
							>
								{tag}
								{idx < data.tech.length - 1 ? <span>,</span> : ""}
							</p>
						))}
					</div>
					{data.links && data.links.length > 0 && (
						<div className="flex flex-wrap gap-x-4 gap-y-2">
							{data.links.map((link) => (
								<a
									key={link.url}
									href={link.url}
									target="_blank"
									rel="noreferrer"
									className="text-sm underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground"
								>
									{link.label}
								</a>
							))}
						</div>
					)}
				</div>
			}
		>
			{data.RenderableMDX}
		</CorePreview>
	);
}
