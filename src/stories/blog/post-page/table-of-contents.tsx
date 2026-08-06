"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { IPAD_TOC_ID, TOC_NAV_ID } from "@/components/nav-constants";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavScrollViewStore } from "@/lib/providers/nav-scroll-view-store-provider";
import { useToCViewStore } from "@/lib/providers/toc-view-store-provider";
import { HeaderTocToggle } from "../../navigation/header/toc-toggle";
import {
	ConcatTitle,
	type FlatHeadingNode,
	type HeadingNode,
	Headings,
	useIntersectionObserver,
} from "./table-of-contents-utils";

export type ToCMenuProps = {
	nestedHeadings: HeadingNode[];
	flatHeadings: FlatHeadingNode[];
};

export function TableOfContentsDesktop(props: ToCMenuProps) {
	const [activeId, setActiveId] = useState("");
	const { tocInView, setToCNotInView } = useToCViewStore((state) => state);
	const menuRef = useRef<HTMLDivElement>(null);

	// Always call the hook (internally it uses useEffect which only runs on the client)
	const { setScrollToHeading } = useIntersectionObserver(setActiveId, activeId);

	return (
		<nav
			id={IPAD_TOC_ID}
			aria-label="Table of Contents (Desktop)"
			className={`${tocInView ? "min-w-80 md:w-80 lg:w-96 lg:min-w-96" : "w-0 min-w-0"}  sticky top-0 hidden max-h-dvh overflow-x-hidden overflow-y-auto border-r border-border bg-muted text-foreground shadow-xl motion-safe:[transition:width_0.8s,min-width_0.8s,background-color_0.5s] md:block`}
		>
			<div className="px-6 sticky top-0 z-10 flex min-h-16 w-full flex-row items-center justify-start text-foreground ">
				<div className="nav-glassy-bg" />
				<div className="nav-glassy-edge" />
				<HeaderTocToggle
					isPost
					tocInView={!tocInView}
					aria-controls={IPAD_TOC_ID}
					onTocToggle={() => {
						setToCNotInView();
						localStorage.setItem("toc-state-pref", "closed");
					}}
				/>
			</div>

			<div ref={menuRef} className="min-w-80 lg:min-w-96">
				<AnimatePresence>
					{tocInView && (
						<Headings
							tree={props.nestedHeadings}
							activeId={activeId}
							ariaExpanded={tocInView}
							onItemClick={(id) => {
								setScrollToHeading();
								setActiveId(id);
							}}
						/>
					)}
				</AnimatePresence>
			</div>
		</nav>
	);
}

export function TableOfContentsMobile(props: ToCMenuProps) {
	const [activeId, setActiveId] = useState("");

	const { setScrollToHeading } = useIntersectionObserver(setActiveId, activeId);

	const { inView } = useNavScrollViewStore((state) => state);

	// Keep the original state to track the trigger's visual state even if the Sheet manages its own open state internally,
	// or we can strictly bind it to the Sheet open state.
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Collapsible
			isExpanded={isOpen}
			onExpandedChange={setIsOpen}
			className={`sticky size-full top-16 z-40 block md:hidden ${inView ? "translate-y-0" : "-translate-y-16"} duration-300 motion-safe:transition-transform`}
		>
			<nav id={TOC_NAV_ID} aria-label="Table of Contents (Mobile)">
				<div className={`absolute z-30 flex w-full flex-row items-center `}>
					<div className="nav-glassy-bg" />
					<div className="nav-glassy-edge" />
					<div className="relative z-35 flex size-full h-12 flex-row items-center gap-4 px-6">
						<CollapsibleTrigger
							id={"show-hide-table-of-contents-button-mobile"}
							className={`z-40 -m-1.5 flex items-center font-mono text-sm whitespace-pre text-muted-foreground hover:text-primary transition-colors ${isOpen ? "text-primary" : ""}`}
						>
							<span
								className={`${isOpen ? "transform-[rotate(90deg)_translate3d(-0.1rem,-0.2ch,0px)]" : "transform-[translate3d(-0.1rem,0.0ch,0px)]"} pointer-events-none mr-[0.5ch] icon-[ph--caret-right-bold] w-[2ch] text-xl [transition:transform_0.3s]`}
							/>
							On this page
						</CollapsibleTrigger>

						<p className="z-40 flex min-w-0 flex-row items-center gap-[1ch] overflow-x-hidden font-mono text-sm whitespace-pre text-foreground">
							<span className="icon-[ph--caret-double-right-bold] min-w-[2ch] text-xl text-muted-foreground" />
							<ConcatTitle headings={props.flatHeadings} activeId={activeId} />
						</p>
					</div>
				</div>
			</nav>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed left-0 top-28 z-20 h-[calc(100dvh-7rem)] w-full bg-black/20 backdrop-blur-sm dark:bg-black/40"
						data-testid="mobile-toc-scrim"
						onClick={() => setIsOpen(false)}
						id="collapsible-scrim"
						aria-hidden="true"
					/>
				)}
			</AnimatePresence>

			<CollapsibleContent
				className={`absolute left-0 right-0 top-12.5 z-30 max-h-[calc(100dvh-12rem)] overflow-y-auto overflow-x-hidden bg-background/95 backdrop-blur-md shadow-xl border-border transition-[height] duration-300 ease-in-out h-(--disclosure-panel-height,0px) ${isOpen ? "border-b" : "border-b-0"}`}
			>
				<div className="px-6 pb-10 pt-4">
					<AnimatePresence>
						{isOpen && (
							<Headings
								tree={props.nestedHeadings}
								activeId={activeId}
								ariaExpanded={isOpen}
								onItemClick={(id) => {
									setScrollToHeading();
									setActiveId(id);
									setIsOpen(false);
								}}
							/>
						)}
					</AnimatePresence>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}

export function TableOfContents(props: ToCMenuProps) {
	return (
		<>
			<TableOfContentsDesktop {...props} />
			<TableOfContentsMobile {...props} />
		</>
	);
}


