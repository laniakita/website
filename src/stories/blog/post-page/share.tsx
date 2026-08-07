"use client";

import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface MinPageData {
	title: string;

	url: string;
}

export const shareUnderChar = (minPageData: MinPageData | undefined, isBsky?: boolean) => {
	if (!minPageData) return "";
	const urlLen = isBsky ? 46 : 23;
	const titleLen = minPageData.title.length;

	if (urlLen + titleLen + 1 > 300) {
		const titleSlice = minPageData.title.slice(0, titleLen - urlLen - 3).split("");
		titleSlice.push("...");
		const titleTrunc = titleSlice.join("");
		return encodeURIComponent(`${titleTrunc} ${minPageData.url}`);
	}
	return `${encodeURIComponent(minPageData.title)} ${encodeURIComponent(minPageData.url)}`;
};

const DEFAULT_INSTANCE = "mastodon.social";

export function ShareButton({ title, url }: { title: string; url: string }) {
	const [isCopied, setIsCopied] = useState(false);
	const [isMastodonOpen, setIsMastodonOpen] = useState(false);
	const [instanceInput, setInstanceInput] = useState(DEFAULT_INSTANCE);

	// Optional fallback if props aren't passed
	const [clientUrl, setClientUrl] = useState(url);
	const [clientTitle, setClientTitle] = useState(title);

	useEffect(() => {
		if (!url && typeof window !== "undefined") {
			setClientUrl(window.location.href);
		}
		if (!title && typeof document !== "undefined") {
			setClientTitle(document.title);
		}
	}, [url, title]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const cachedInstance = localStorage.getItem("mastodon-instance");
			if (cachedInstance && cachedInstance.length > 0) {
				setInstanceInput(cachedInstance);
			}
		}
	}, []);

	const pageData = { title: clientTitle, url: clientUrl };

	const handleCopy = () => {
		navigator.clipboard.writeText(clientUrl);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	const shareToMastodon = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const userInstance = formData.get("mastodon-instance");
		let targetInstance = DEFAULT_INSTANCE;

		if (typeof userInstance === "string" && userInstance.length > 0) {
			localStorage.setItem("mastodon-instance", userInstance);
			targetInstance = userInstance;
		} else {
			const cached = localStorage.getItem("mastodon-instance");
			if (cached) targetInstance = cached;
		}

		const returnUrl = `https://${targetInstance}/share?text=${encodeURIComponent(clientTitle)}%0A%0A${encodeURIComponent(clientUrl)}`;
		window.open(returnUrl, "_blank", "noreferrer=true")?.focus();
		setIsMastodonOpen(false);
	};

	return (
		<>
			<DropdownMenuTrigger>
				<Button className='z-10 flex flex-row items-center justify-center gap-2 rounded-full border border-primary bg-primary/10 px-8 py-2 font-black font-mono text-primary outline-none transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground'>
					<span className='icon-[ph--upload-bold] text-2xl' />
					<span>share</span>
				</Button>
				<DropdownMenu
					placement='bottom'
					offset={10}
					className='min-w-48 rounded-xl border border-secondary bg-background/50 p-1.5 font-mono shadow-lg backdrop-blur-md'
				>
					<DropdownMenuItem
						onAction={handleCopy}
						className='group cursor-pointer gap-2 rounded-md hover:bg-primary hover:text-primary-foreground data-focused:bg-primary! data-focused:text-primary-foreground!'
					>
						<span className='icon-[ph--link] text-xl group-hover:text-primary-foreground group-data-focused:text-primary-foreground!' />
						{isCopied ? "copied!" : "copy link"}
					</DropdownMenuItem>

					<DropdownMenuItem className='group cursor-pointer gap-2 rounded-md hover:bg-[#1185FE] hover:text-primary-foreground data-focused:bg-[#1185FE]! data-focused:text-primary-foreground!'>
						<a
							href={`https://bsky.app/intent/compose?text=${shareUnderChar(pageData, true)}`}
							target='_blank'
							rel='noreferrer'
							className='flex w-full items-center gap-2 group-hover:text-primary-foreground group-data-focused:text-primary-foreground!'
						>
							<span className='icon-[fa6-brands--bluesky] text-xl group-hover:text-primary-foreground group-data-focused:text-primary-foreground!' />
							Bluesky
						</a>
					</DropdownMenuItem>

					<DropdownMenuItem
						onAction={() => {
							setIsMastodonOpen(true);
						}}
						className='group cursor-pointer gap-2 rounded-md hover:bg-[#563ACC] hover:text-primary-foreground data-focused:bg-[#563ACC]! data-focused:text-primary-foreground!'
					>
						<span className='icon-[fa6-brands--mastodon] text-xl group-hover:text-primary-foreground group-data-focused:text-primary-foreground!' />
						Mastodon
					</DropdownMenuItem>

					<DropdownMenuItem className='group cursor-pointer gap-2 rounded-md hover:bg-[#0a66c2]! hover:text-primary-foreground data-focused:bg-[#0a66c2]! data-focused:text-primary-foreground!'>
						<a
							href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(clientUrl)}`}
							target='_blank'
							rel='noreferrer'
							className='flex w-full items-center gap-2 group-hover:text-primary-foreground group-data-focused:text-primary-foreground!'
						>
							<span className='icon-[fa6-brands--linkedin] text-xl group-hover:text-primary-foreground group-data-focused:text-primary-foreground!' />
							LinkedIn
						</a>
					</DropdownMenuItem>

					<DropdownMenuItem className='group cursor-pointer gap-2 rounded-md hover:bg-[#ff6719]! hover:text-primary-foreground data-focused:bg-[#ff6719]! data-focused:text-primary-foreground!'>
						<a
							href={`https://substack.com/notes?action=compose&message=${encodeURIComponent(clientTitle)} ${encodeURIComponent(clientUrl)}`}
							target='_blank'
							rel='noreferrer'
							className='flex w-full items-center gap-2 group-hover:text-primary-foreground group-data-focused:text-primary-foreground!'
						>
							<span className='icon-[simple-icons--substack] text-xl group-hover:text-primary-foreground group-data-focused:text-primary-foreground!' />
							Substack
						</a>
					</DropdownMenuItem>
				</DropdownMenu>
			</DropdownMenuTrigger>

			<Dialog isOpen={isMastodonOpen} onOpenChange={setIsMastodonOpen}>
				<DialogHeader>
					<DialogTitle className='sr-only'>Share to Mastodon</DialogTitle>
				</DialogHeader>
				<div className='py-6'>
					<form onSubmit={shareToMastodon} className='flex flex-col gap-4'>
						<label htmlFor='mastodon-instance' className='font-semibold text-foreground'>
							mastodon_server: {instanceInput.length > 0 ? instanceInput : DEFAULT_INSTANCE}
						</label>
						<div className='relative flex flex-row'>
							<input
								id='mastodon-instance'
								name='mastodon-instance'
								type='text'
								placeholder={instanceInput.length > 0 ? instanceInput : DEFAULT_INSTANCE}
								onChange={(e) => setInstanceInput(e.target.value)}
								className='w-full rounded-l-lg border border-ctp-surface0 border-r-0 bg-background px-4 py-3 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ctp-mauve'
							/>
							<button
								type='submit'
								className='rounded-r-lg bg-ctp-mauve px-6 font-bold text-ctp-base transition-colors hover:bg-ctp-pink'
							>
								share
							</button>
						</div>
					</form>
				</div>
			</Dialog>
		</>
	);
}
export function ShareButtonSkeleton() {
	return (
		<div className='z-10 flex h-10 w-32 animate-pulse flex-row items-center justify-center gap-2 rounded-full border border-ctp-mauve/50 bg-ctp-mauve/10 px-8 py-2'>
			<div className='size-6 animate-pulse rounded-full bg-ctp-mauve/40' />
			<div className='h-4 w-12 animate-pulse rounded bg-ctp-mauve/40' />
		</div>
	);
}
