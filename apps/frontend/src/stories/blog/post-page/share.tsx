"use client";

import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import * as v from "valibot";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "$/src/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "$/src/components/ui/field";
import { Input } from "$/src/components/ui/input";

const DEFAULT_INSTANCE = "mastodon.social";

const mastadonInstanceFormSchema = v.object({
	instance: v.pipe(
		v.string(),
		v.trim(),
		v.transform((val) => val || DEFAULT_INSTANCE),
	),
});

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

export function ShareButton({ title, url }: { title: string; url: string }) {
	const [isCopied, setIsCopied] = useState(false);
	const [isMastodonOpen, setIsMastodonOpen] = useState(false);

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

	const pageData = { title: clientTitle, url: clientUrl };

	const handleCopy = () => {
		navigator.clipboard.writeText(clientUrl);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	const form = useForm({
		defaultValues: {
			instance: (typeof window !== "undefined" ? localStorage.getItem("mastodon-instance") : null) || DEFAULT_INSTANCE,
		},
		validators: {
			onSubmit: mastadonInstanceFormSchema,
		},
		onSubmit: async ({ value }) => {
			localStorage.setItem("mastodon-instance", value.instance);
			const returnUrl = `https://${value.instance}/share?text=${encodeURIComponent(clientTitle)}%0A%0A${encodeURIComponent(clientUrl)}`;
			window.open(returnUrl, "_blank", "noreferrer=true")?.focus();
			setIsMastodonOpen(false);
		},
	});

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

			<Dialog isOpen={isMastodonOpen} onOpenChange={setIsMastodonOpen} className='bg-card/80'>
				<form
					id='mastadon-instance-form'
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>Share to Mastodon</DialogTitle>
					</DialogHeader>
					<FieldGroup className='mt-4'>
						<form.Field
							name='instance'
							// biome-ignore lint/correctness/noChildrenProp: part of tanstack form
							children={(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} className='font-semibold text-foreground'>
											mastodon server
										</FieldLabel>
										<div className='relative flex flex-row'>
											<Input
												id={field.name}
												name={field.name}
												type='text'
												value={field.state.value}
												placeholder={DEFAULT_INSTANCE}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												autoComplete='off'
											/>
											<Button
												type='submit'
												className='absolute top-1 right-1 h-7 bg-ctp-mauve px-6 font-bold font-mono text-ctp-base transition-colors hover:bg-ctp-pink'
											>
												share
											</Button>
										</div>
										{isInvalid && <FieldError errors={field.state.meta.errors} />}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>
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
