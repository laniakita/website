"use client";

import { Image } from "@unpic/react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import type * as React from "react";
import { Suspense, useRef } from "react";
import { Link } from "@/components/ui/link";
import { TextBlockSkeleton } from "@/stories/skeletons/text-block-skeleton";
import { Separator } from "$/src/components/ui/separator";
import { cn } from "$/src/lib/utils/cn";

/**
 * Configuration options for the parallax scroll effect.
 * Allows overriding the spring physics and layer translation speeds.
 */
export interface WorkPreviewParallaxConfig {
	/**
	 * Framer Motion useSpring configuration to give the scroll a physical, "pulley" feel.
	 */
	spring?: {
		/** Tension of the spring. Higher is stiffer (snaps back faster). */
		stiffness?: number;
		/** Friction applied to the spring. Higher damping reduces bounciness. */
		damping?: number;
		/** Value threshold for the spring to be considered at rest. */
		restDelta?: number;
	};
	/**
	 * Translation ranges mapped from [0, 1] scroll progress.
	 * Values should be strings with units (e.g., ["-40px", "40px"]).
	 */
	speeds?: {
		/** Parallax speed for the massive typography title block */
		title?: [string, string];
		/** Parallax speed for the main image container */
		image?: [string, string];
		/** Parallax speed for the glassmorphic description plaque */
		desc?: [string, string];
	};
}

export interface WorkPreviewProps {
	/** Unique identifier */
	id: string;
	/** Title of the work */
	title: string;
	/** External or internal source URL */
	source: string;
	/** Project or client work */
	type?: string;
	/** Is the link active/valid? */
	active: boolean;
	/** Date of creation */
	createdAt: Date | string;
	/** Optional date indicating when the work was last modified */
	lastModified?: Date | string;
	/** Optional cover image */
	featured_image?: {
		src: string;
		localHash?: string;
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
	/** Index for alternating layouts */
	index?: number;
	/** Optional configuration for the parallax spring and speeds */
	parallax?: WorkPreviewParallaxConfig;
}

function formatDate(date: Date | string) {
	const d = new Date(date);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
	}).format(d);
}

/**
 * An editorial-style preview component that alternates layout
 * based on its index, featuring large typography and parallax imagery.
 * On mobile, it collapses into a Parallax Collage.
 */
export function WorkPreview({
	parallax = {
		spring: { stiffness: 100, damping: 30, restDelta: 0.001 },
		speeds: {
			title: ["-40px", "40px"],
			image: ["60px", "-60px"],
			desc: ["-10px", "10px"],
		},
	},
	...data
}: WorkPreviewProps) {
	const targetUrl = data.source;
	const isExternal = data.source.startsWith("http");
	const index = data.index ?? 0;
	const isEven = index % 2 === 0;

	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	// Apply spring physics to the scroll progress for a natural "pulley" feel
	const smoothProgress = useSpring(scrollYProgress, parallax.spring);

	// Mobile Parallax Collage Speeds (driven by the spring)
	// Title lingers more (scrolls slower), Image speeds up, Desc lingers less.
	// This makes the Title and Desc "compress" towards each other over the scroll.
	const titleY = useTransform(smoothProgress, [0, 1], parallax.speeds?.title || ["-40px", "40px"]);
	const imageY = useTransform(smoothProgress, [0, 1], parallax.speeds?.image || ["60px", "-60px"]);
	const descY = useTransform(smoothProgress, [0, 1], parallax.speeds?.desc || ["-10px", "10px"]);

	const LinkWrapper = ({ className, children }: { className?: string; children: React.ReactNode }) => {
		if (isExternal) {
			return (
				<a
					href={targetUrl}
					target='_blank'
					rel='noreferrer noopener'
					className={cn("links font-bold underline", className)}
				>
					{children}
				</a>
			);
		}
		return (
			<Link to={targetUrl} className={cn("links font-bold underline", className)}>
				{children}
			</Link>
		);
	};

	return (
		<div className='@container w-full min-w-full'>
			<div ref={ref} className='group relative grid w-full @3xl:grid-cols-2 grid-cols-1 @3xl:gap-x-24 py-10'>
				{/* 1. Title Block */}
				<motion.div
					style={{ y: titleY }}
					className={cn(
						"z-20 flex w-full flex-col items-start @3xl:px-0 px-2 mix-blend-difference",
						isEven ? "@3xl:col-start-1 @3xl:text-left" : "@3xl:col-start-2 @3xl:items-end @3xl:text-right",
						"@3xl:row-start-1 @3xl:self-end",
					)}
				>
					{/* Meta */}
					<div
						className={cn(
							"flex font-mono text-2xs text-primary uppercase tracking-widest supports-[mix-blend-mode:difference]:text-primary-diff",
							"before:mr-1 before:content-['>']",
							!isEven && "@3xl:before:content-none @3xl:after:ml-1 @3xl:after:content-['<']",
						)}
					>
						{formatDate(data.lastModified ?? data.createdAt)}
					</div>

					{/* Title */}
					<h2
						className={cn(
							"mb-4 text-balance font-black font-heading",
							"wrap-break-word @2xl:text-6xl @3xl:text-7xl @xl:text-5xl text-4xl leading-[0.9] tracking-tighter",
						)}
					>
						<LinkWrapper
							className={cn(
								"text-foreground no-underline group-has-[.image-target:hover]:underline",
								"supports-[mix-blend-mode:difference]:text-foreground-diff",
								"supports-[mix-blend-mode:difference]:group-has-[.image-target:hover]:text-primary-diff",
								"supports-[mix-blend-mode:difference]:hover:text-primary-diff",
							)}
						>
							<span className='relative'>{data.title}</span>
						</LinkWrapper>
					</h2>
				</motion.div>

				{/* 2. Image Parallax Container */}
				<motion.div
					style={{ y: imageY }}
					className={cn(
						"image-target relative z-10 -mt-10 w-full overflow-hidden rounded-sm",
						"@3xl:mt-0 @3xl:self-center bg-ctp-surface0 shadow-xl dark:bg-ctp-crust",
						isEven ? "@3xl:col-start-2" : "@3xl:col-start-1",
						"@3xl:row-span-2 @3xl:row-start-1",
					)}
				>
					{data.featured_image?.src ? (
						<LinkWrapper className='block h-full w-full'>
							{data.featured_image.imgData?.height && data.featured_image.imgData?.width ? (
								<Image
									src={data.featured_image.src}
									height={data.featured_image.imgData.height}
									width={data.featured_image.imgData.width}
									alt={data.featured_image.altText ?? ""}
									background={data.featured_image.imgData.css}
									fallback='cloudflare'
									options={{
										cloudflare: {
											domain: import.meta.env.VITE_CDN,
										},
									}}
									operations={{
										cloudflare: {
											quality: 75,
											format: "auto",
										},
									}}
									layout='constrained'
									className={cn(
										"h-auto w-full object-contain grayscale-[0.3]",
										"transition-all duration-700 hover:grayscale-0",
									)}
								/>
							) : (
								<Image
									src={data.featured_image.src}
									layout='fullWidth'
									alt={data.featured_image.altText ?? ""}
									className={cn(
										"h-auto w-full object-contain grayscale-[0.3]",
										"transition-all duration-700 hover:grayscale-0",
									)}
								/>
							)}
						</LinkWrapper>
					) : (
						<div className='flex aspect-video w-full items-center justify-center text-muted-foreground'>
							<span className='icon-[ph--image] text-4xl opacity-20' />
						</div>
					)}
				</motion.div>

				{/* 3. Description Plaque */}
				<motion.div
					style={{ y: descY }}
					className={cn(
						"z-30 -mt-10 @3xl:mt-0 flex w-full flex-col",
						isEven ? "@3xl:col-start-1 @3xl:items-start" : "@3xl:col-start-2 @3xl:items-end @3xl:text-right",
						"@3xl:row-start-2 @3xl:self-start @3xl:px-0 px-2",
					)}
				>
					{/* Glassmorphic card for mobile legibility, transparent on desktop */}
					<div
						className={cn(
							"relative flex w-full flex-col overflow-hidden rounded-xl",
							"@3xl:rounded-none @3xl:p-0 p-4 @3xl:shadow-none shadow-2xl",
						)}
					>
						{/* High-tech glass backgrounds (mobile only) */}
						<div className='work-glassy-bg @3xl:hidden' />
						{/* <div className='work-glassy-edge @3xl:hidden' /> */}

						<div className='relative z-10 flex w-full flex-col gap-y-4'>
							<Suspense fallback={<TextBlockSkeleton />}>{data.RenderableMDX}</Suspense>
							<Separator />
							{/* Footer (Tech & Links) */}
							<div className={cn("flex w-full flex-col gap-4", isEven ? "items-start" : "items-start @3xl:items-end")}>
								<div
									className={cn("flex flex-wrap gap-1", isEven ? "justify-start" : "justify-start @3xl:justify-end")}
								>
									{data.tech.map((tag) => (
										<span
											key={`tech-${tag}`}
											className={cn(
												"rounded-sm border border-secondary px-1.5 py-0.5",
												"font-mono text-secondary-foreground",
												"text-2xs @3xl:shadow-none shadow-sm",
											)}
										>
											{tag}
										</span>
									))}
								</div>
								{data.links && data.links.length > 0 && (
									<>
										<Separator />
										<div
											className={cn(
												"mt-2 flex flex-wrap gap-6",
												isEven ? "justify-start" : "justify-start @3xl:justify-end",
											)}
										>
											{data.links.map((link) =>
												link.url.startsWith("http") ? (
													<a
														key={link.url}
														href={link.url}
														target='_blank'
														rel='noreferrer'
														className={cn(
															"font-mono text-sm uppercase tracking-widest",
															"underline decoration-muted-foreground",
															"underline-offset-4 hover:decoration-foreground",
														)}
													>
														{link.label}
													</a>
												) : (
													<Link
														key={link.url}
														to={link.url}
														className={cn(
															"font-mono text-sm uppercase tracking-widest",
															"underline decoration-muted-foreground",
															"underline-offset-4 hover:decoration-foreground",
														)}
													>
														{link.label}
													</Link>
												),
											)}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
