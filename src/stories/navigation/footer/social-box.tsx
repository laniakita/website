import type * as React from "react";
import { cn } from "@/lib/utils";
import type { FooterSocialItem } from "$/src/components/navigation/footer/data";

export interface FooterSocialBoxProps
	extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	items: FooterSocialItem[];
}

export function FooterSocialBox(props: FooterSocialBoxProps) {
	return (
		<div className={cn("size-min", props.className)} {...props}>
			<nav
				aria-label={props.title}
				className="flex break-inside-avoid flex-col"
			>
				<h3 className="pb-2 font-heading text-xl font-extrabold capitalize text-foreground">
					{props.title}
				</h3>
				<div className="flex flex-col space-y-1 text-lg">
					{props.items?.map((item) => (
						<a
							key={item.title}
							href={item.url}
							target="_blank"
							rel={
								item.title.toLowerCase() === "mastodon"
									? "me noopener noreferrer"
									: "noopener noreferrer"
							}
							className="w-fit whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
							type={
								item.url.endsWith(".xml") ? "application/atom+xml" : undefined
							}
						>
							{item.title}
						</a>
					))}
				</div>
			</nav>
		</div>
	);
}
