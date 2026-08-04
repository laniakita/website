"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-aria-components";
import { IPAD_TOC_ID, TOC_NAV_ID } from "@/components/nav-constants";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
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
	useIntersectionObserver(setActiveId, activeId);

	return (
		<nav
			id={IPAD_TOC_ID}
			className={`${tocInView ? "min-w-80 md:w-80 lg:w-96 lg:min-w-96" : "w-0 min-w-0"}  sticky top-0 hidden max-h-dvh overflow-x-hidden overflow-y-auto border-r border-border bg-background text-foreground shadow-xl motion-safe:[transition:width_0.8s,min-width_0.8s,background-color_0.5s] md:block`}
		>
			<div className="px-6 sticky top-0 z-10 flex min-h-16 w-full flex-row items-center justify-start text-foreground ">
				<div className="nav-glassy-bg" />
				<div className="nav-glassy-edge" />
				{/*
				<Button
					aria-label="Close Table of Contents"
					aria-expanded="false"
					aria-controls={IPAD_TOC_ID}
					onPress={() => {
						setToCNotInView();
						localStorage.setItem("toc-state-pref", "closed");
					}}
					className="icon-[ph--sidebar-simple-fill] size-6 hover:text-muted-foreground transition-colors"
				/>*/}
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

			<div ref={menuRef} className="min-w-80 lg:min-w-96 p-4">
				<AnimatePresence>
					{tocInView && (
						<Headings
							tree={props.nestedHeadings}
							activeId={activeId}
							ariaExpanded={tocInView}
							onItemClick={(id) => setActiveId(id)}
						/>
					)}
				</AnimatePresence>
			</div>
		</nav>
	);
}

export function TableOfContentsMobile(props: ToCMenuProps) {
	const [activeId, setActiveId] = useState("");

	useIntersectionObserver(setActiveId, activeId);

	const { inView } = useNavScrollViewStore((state) => state);

	// Keep the original state to track the trigger's visual state even if the Sheet manages its own open state internally,
	// or we can strictly bind it to the Sheet open state.
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<nav
				id={TOC_NAV_ID}
				className={`sticky top-16 z-40 block md:hidden ${inView ? "translate-y-0" : "-translate-y-16"} duration-300 motion-safe:transition-transform`}
			>
				<div className={`absolute z-30 flex w-full flex-row items-center `}>
					<div className="nav-glassy-bg" />
					<div className="nav-glassy-edge" />
					<div className="relative z-35 flex size-full h-12 flex-row items-center gap-4 px-6">
						<Button
							onPress={() => setIsOpen(!isOpen)}
							aria-expanded={isOpen}
							aria-controls={TOC_NAV_ID}
							id={"show-hide-table-of-contents-button-mobile"}
							className={`z-40 -m-1.5 flex items-center font-mono text-sm whitespace-pre text-muted-foreground hover:text-primary transition-colors ${isOpen ? "text-primary" : ""}`}
						>
							<span
								className={`${isOpen ? "transform-[rotate(90deg)_translate3d(-0.1rem,-0.2ch,0px)]" : "transform-[translate3d(-0.1rem,0.0ch,0px)]"} pointer-events-none mr-[0.5ch] icon-[ph--caret-right-bold] w-[2ch] text-xl [transition:transform_0.3s]`}
							/>
							On this page
						</Button>

						<p className="z-40 flex min-w-0 flex-row items-center gap-[1ch] overflow-x-hidden font-mono text-sm whitespace-pre text-foreground">
							<span className="icon-[ph--caret-double-right-bold] min-w-[2ch] text-xl text-muted-foreground" />
							<ConcatTitle headings={props.flatHeadings} activeId={activeId} />
						</p>
					</div>
				</div>
			</nav>

			<SheetContent
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				side="top"
				overlayClassName="!z-30"
				className="pt-28 pb-10 px-6 max-h-[85vh] overflow-y-auto !z-30"
			>
				<SheetTitle className="sr-only">Table of Contents</SheetTitle>
				<AnimatePresence>
					{isOpen && (
						<Headings
							tree={props.nestedHeadings}
							activeId={activeId}
							ariaExpanded={isOpen}
							onItemClick={(id) => {
								setActiveId(id);
								setIsOpen(false);
							}}
						/>
					)}
				</AnimatePresence>
			</SheetContent>
		</>
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

export function TableOfContentsDesktopSkeleton() {
	return (
		<nav className="sticky top-0 hidden max-h-dvh min-w-80 overflow-x-hidden overflow-y-auto border-r border-border bg-background shadow-xl md:block md:w-80 lg:w-96 lg:min-w-96">
			<div className="sticky top-0 z-10 flex min-h-16 w-full flex-row items-center justify-start bg-background/80 px-4 backdrop-blur-md">
				<div className="h-6 w-6 animate-pulse rounded bg-muted" />
			</div>
			<div className="p-4">
				<div className="flex flex-col gap-4">
					<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
					<div className="h-4 w-1/2 animate-pulse rounded bg-muted ml-4" />
					<div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
					<div className="h-4 w-2/3 animate-pulse rounded bg-muted ml-4" />
					<div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
				</div>
			</div>
		</nav>
	);
}

export function TableOfContentsMobileSkeleton() {
	return (
		<nav className="sticky top-16 z-40 block w-full md:hidden">
			<div className="absolute z-30 flex w-full flex-row items-center border-b border-border/50 bg-background/80 backdrop-blur-sm">
				<div className="relative z-35 flex size-full h-12 flex-row items-center gap-4 px-6">
					<div className="h-4 w-24 animate-pulse rounded bg-muted" />
					<div className="flex flex-row items-center gap-2 overflow-hidden">
						<span className="icon-[ph--caret-double-right-bold] text-muted" />
						<div className="h-4 w-32 animate-pulse rounded bg-muted" />
					</div>
				</div>
			</div>
		</nav>
	);
}
