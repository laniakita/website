import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/providers/theme-store-provider";

export function Comments() {
	const { theme } = useThemeStore((state) => state);
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		if (theme === "auto") {
			setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
		} else {
			setIsDark(theme === "dark");
		}
	}, [theme]);

	const themePref = isDark
		? "https://giscus.catppuccin.com/themes/mocha.css"
		: "https://giscus.catppuccin.com/themes/latte.css";

	return (
		<div className="p-6">
			<div className="mx-auto size-full max-w-3xl md:max-w-2xl" data-testid="comments-container">
				<Giscus
					id="comment"
					repo="laniakita/website"
					repoId="R_kgDOLYjaFQ"
					category="Announcements"
					categoryId="DIC_kwDOLYjaFc4Cf0F_"
					mapping="pathname"
					strict="0"
					reactionsEnabled="1"
					emitMetadata="1"
					inputPosition="top"
					theme={themePref}
					lang="en"
					loading="lazy"
				/>
			</div>
		</div>
	);
}
export function CommentsSkeleton() {
	return (
		<div className="p-6">
			<div className="mx-auto size-full max-w-3xl md:max-w-2xl">
				<div className="flex flex-col gap-6">
					{/* Header skeleton */}
					<div className="flex flex-row items-center justify-between">
						<div className="h-6 w-32 animate-pulse rounded bg-muted" />
						<div className="h-6 w-24 animate-pulse rounded bg-muted" />
					</div>
					
					{/* Input box skeleton */}
					<div className="flex flex-col gap-2">
						<div className="h-24 w-full animate-pulse rounded-md bg-muted" />
						<div className="flex justify-end">
							<div className="h-8 w-20 animate-pulse rounded bg-muted" />
						</div>
					</div>

					{/* Comments list skeleton */}
					<div className="flex flex-col gap-6 pt-4">
						<div className="flex flex-row gap-4">
							<div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
							<div className="flex w-full flex-col gap-2">
								<div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
								<div className="h-16 w-full animate-pulse rounded-md bg-muted" />
							</div>
						</div>
						<div className="flex flex-row gap-4">
							<div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
							<div className="flex w-full flex-col gap-2">
								<div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
								<div className="h-12 w-full animate-pulse rounded-md bg-muted" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
