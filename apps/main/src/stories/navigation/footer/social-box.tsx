import type * as React from "react";
import type { SocialItem } from "@/components/navigation/types";
import { cn } from "$/src/lib/utils/cn";

export interface FooterSocialBoxProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	items: SocialItem[];
}

export function FooterSocialBox(props: FooterSocialBoxProps) {
	return (
		<div className={cn("size-min", props.className)} {...props}>
			<nav aria-label={props.title} className='flex break-inside-avoid flex-col'>
				<h3 className='pb-2 font-extrabold font-heading text-foreground text-xl capitalize'>{props.title}</h3>
				<div className='flex flex-col space-y-1 text-lg'>
					{props.items?.map((item) => (
						<a
							key={item.title}
							href={item.url}
							target='_blank'
							rel={item.title.toLowerCase() === "mastodon" ? "me noopener noreferrer" : "noopener noreferrer"}
							className='links w-fit text-muted-foreground capitalize hover:text-primary'
							type={item.url.endsWith(".xml") ? "application/atom+xml" : undefined}
						>
							{item.title}
						</a>
					))}
				</div>
			</nav>
		</div>
	);
}
