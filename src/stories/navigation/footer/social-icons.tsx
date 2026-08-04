import type * as React from "react";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import type { FooterSocialItem } from "$/src/components/navigation/footer/data";

export interface FooterSocialIconsProps
	extends React.HTMLAttributes<HTMLDivElement> {
	items: FooterSocialItem[];
}

export function FooterSocialIcons(props: FooterSocialIconsProps) {
	return (
		<div className={cn("grid grid-cols-3 gap-2", props.className)} {...props}>
			{props.items?.map((item) => (
				<Link
					key={item.title}
					to={item.url}
					target="_blank"
					rel={
						item.title.toLowerCase() === "mastodon"
							? "me noopener noreferrer"
							: "noopener noreferrer"
					}
					aria-label={`Follow on ${item.linkName}`}
					className="flex basis-full items-center justify-center rounded border border-border p-2 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
				>
					<span
						className={cn(item.iconName, "text-2xl md:text-3xl", item.textSize)}
						aria-hidden="true"
					/>
					<span className="sr-only">{item.linkName}</span>
				</Link>
			))}
		</div>
	);
}
