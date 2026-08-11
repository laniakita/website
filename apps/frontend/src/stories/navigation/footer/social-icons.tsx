import type * as React from "react";
import type { SocialItem } from "@/components/navigation/types";
import { Link } from "@/components/ui/link";
import { cn } from "$/src/lib/utils/cn";

export interface FooterSocialIconsProps extends React.HTMLAttributes<HTMLDivElement> {
	items: SocialItem[];
}

export function FooterSocialIcons(props: FooterSocialIconsProps) {
	return (
		<div className={cn("grid grid-cols-3 gap-2", props.className)} {...props}>
			{props.items?.map((item) => (
				<Link
					key={item.title}
					to={item.url}
					target='_blank'
					rel={item.title.toLowerCase() === "mastodon" ? "me noopener noreferrer" : "noopener noreferrer"}
					aria-label={`Follow on ${item.linkName}`}
					className='flex basis-full items-center justify-center rounded border border-border p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground'
				>
					<span className={cn(item.iconName, "@xl:text-3xl text-2xl", item.textSize)} aria-hidden='true' />
					<span className='sr-only'>{item.linkName}</span>
				</Link>
			))}
		</div>
	);
}
