"use client";
// Force HMR update

import { motion } from "motion/react";
import {
	type Dispatch,
	type SetStateAction,
	Suspense,
	useEffect,
	useId,
	useRef,
} from "react";

const TW_SPACING = 0.25;

export const MED_SCREEN = 768; // px
const MD_MAX_TOC_WIDTH = "md:max-w-76";
const LG_MAX_TOC_WIDTH = "lg:max-w-92";

export interface HeadingNode {
	depth: number;
	url: string;
	title: string;
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.035,
		},
	},
};

const item = {
	hidden: { opacity: 0 },
	show: { opacity: 1 },
};

export function Headings({
	tree,
	activeId,
	ariaExpanded,
	onItemClick,
}: {
	tree: HeadingNode[];
	activeId: string;
	ariaExpanded: boolean;
	onItemClick?: (id: string) => void;
}) {
	return (
		<motion.menu
			aria-expanded={ariaExpanded}
			variants={container}
			initial="hidden"
			animate="show"
			exit="hidden"
			className="list-none leading-relaxed m-0 p-0"
		>
			{tree?.map((heading) => (
				<Suspense key={heading.url} fallback={null}>
					<HeadingLink
						node={heading}
						isActive={activeId === heading.url.substring(1)}
						onItemClick={onItemClick}
					/>
				</Suspense>
			))}
		</motion.menu>
	);
}

export function HeadingLink({
	node,
	isActive,
	onItemClick,
}: {
	node: HeadingNode;
	isActive: boolean;
	onItemClick?: (id: string) => void;
}) {
	const id = useId();
	const linkId = `toc-link${id}`;

	const nodeId = node.url.substring(1);

	return (
		<motion.li key={node.url} variants={item}>
			<p className="group m-0 p-0">
				<a
					href={node.url}
					id={linkId}
					aria-label={`Jump to: ${node.url}`}
					className={`inline-block w-full border-b border-border/20 py-1 text-left group-hover:bg-muted/50 ${isActive ? "bg-muted/50" : ""} transition-colors duration-300`}
					onClick={(e) => {
						e.preventDefault();
						window.history.pushState(null, "", node.url);
						const el = document.getElementById(nodeId);
						el?.scrollIntoView({ behavior: "smooth" });
						// Pause intersection observer and trigger manual active state
						setScrollToHeading();
						onItemClick?.(nodeId);
					}}
				>
					<span
						className={`pointer-events-none inline-block pr-[2ch] font-mono text-sm leading-relaxed font-semibold text-balance transition-colors group-hover:text-foreground group-hover:underline [&>code]:pretty-inline-code ${isActive ? "text-foreground underline" : "text-muted-foreground"} break-words ${MD_MAX_TOC_WIDTH} ${LG_MAX_TOC_WIDTH}`}
						style={{ paddingLeft: `${node.depth * 2}ch` }}
						//biome-ignore lint/security/noDangerouslySetInnerHtml: MDX headings are safe
						dangerouslySetInnerHTML={{ __html: node.title }}
					/>
				</a>
			</p>
		</motion.li>
	);
}

// inspired by Emma Goto React ToC: https://www.emgoto.com/react-table-of-contents

let isScrollingToHeading = false;
let scrollTimeout: NodeJS.Timeout | null = null;

export const setScrollToHeading = () => {
	isScrollingToHeading = true;
	if (scrollTimeout) clearTimeout(scrollTimeout);
	// Fallback timeout in case scrolling doesn't fire long enough
	scrollTimeout = setTimeout(() => {
		isScrollingToHeading = false;
	}, 1000);
};

export const useIntersectionObserver = (
	setActiveId: Dispatch<SetStateAction<string>>,
	activeId: string,
) => {
	const headingElsRef = useRef<Record<string, IntersectionObserverEntry>>({});

	// Track scroll interactions to pause the observer during a click
	useEffect(() => {
		const onScroll = () => {
			if (isScrollingToHeading && scrollTimeout) {
				clearTimeout(scrollTimeout);
				scrollTimeout = setTimeout(() => {
					isScrollingToHeading = false;
				}, 100);
			}
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const headingEls = Array.from(
			document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
		);

		const callback = (headings: IntersectionObserverEntry[]) => {
			if (isScrollingToHeading) return; // Pause tracking while smooth scrolling

			headingElsRef.current = headings.reduce<
				Record<string, IntersectionObserverEntry>
			>((map, headingEl) => {
				map[headingEl.target.id] = headingEl;
				return map;
			}, headingElsRef.current);

			const visibleHeadings: IntersectionObserverEntry[] = [];

			if (headingElsRef.current) {
				for (const key of Object.keys(headingElsRef.current)) {
					const headingEl = headingElsRef.current[key];
					if (headingEl?.isIntersecting) visibleHeadings.push(headingEl);
				}
			}

			const getIndexFromId = (id: string): number => {
				return headingEls.findIndex((heading) => heading.id === id);
			};

			if (visibleHeadings.length === 0) {
				const activeIndex = headingEls.findIndex((el) => el.id === activeId);
				const activeElement = headingEls[activeIndex];

				const activeIdYcoord = activeElement?.getBoundingClientRect().y;
				if (activeIdYcoord && activeIdYcoord > 150 && activeIndex !== 0) {
					setActiveId(headingEls[activeIndex - 1]?.id ?? "");
				}
			} else if (visibleHeadings.length === 1) {
				setActiveId(visibleHeadings[0]?.target.id ?? "");
			} else if (visibleHeadings.length > 1) {
				const sortedVisibleHeadings = visibleHeadings.sort(
					(a, b) => getIndexFromId(a.target.id) - getIndexFromId(b.target.id),
				);
				setActiveId(sortedVisibleHeadings[0]?.target.id ?? "");
			}
		};

		const DESKTOP_TABLET_TOP_TOTAL = "-72px"; // 3.8 rem base 16px font +/- 72px
		const MOBILE_MENU_TOP_TOTAL = "-112px"; // 7 rem base 16px font +/- 112px

		const observer = new IntersectionObserver(callback, {
			rootMargin: `${window.innerWidth < MED_SCREEN ? MOBILE_MENU_TOP_TOTAL : DESKTOP_TABLET_TOP_TOTAL} 0px -40% 0px`,
		});

		headingEls.forEach((el) => {
			observer.observe(el);
		});

		return () => {
			observer.disconnect();
		};
	}, [setActiveId, activeId]);
};

export type FlatHeadingNode = {
	id: string;
	content: string;
};

export function ConcatTitle({
	activeId,
	headings,
}: {
	activeId: string;
	headings: FlatHeadingNode[];
}) {
	const activeHeading =
		headings?.find((heading) => heading.id === activeId)?.content ??
		headings?.[0]?.content ??
		"On this page";

	return (
		<strong
			className="truncate block [&>code]:pretty-inline-code"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML string originates from safe concatenation of MDX heading
			dangerouslySetInnerHTML={{ __html: activeHeading }}
		/>
	);
}
