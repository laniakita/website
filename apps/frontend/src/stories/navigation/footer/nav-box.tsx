import type * as React from "react";
import type { NavItem } from "@/components/navigation/types";
import { Link } from "@/components/ui/link";
import { cn } from "$/src/lib/utils/cn";

export interface FooterNavBoxProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	items: NavItem[];
}

export function FooterNavBox(props: FooterNavBoxProps) {
	return (
		<div className={cn("size-min", props.className)} {...props}>
			<nav aria-label={props.title} className='flex break-inside-avoid flex-col'>
				<h2 className='pb-2 font-extrabold font-heading text-foreground text-xl capitalize'>{props.title}</h2>
				<div className='flex flex-col space-y-1 text-lg'>
					{props.items?.map((item) => (
						<Link
							key={item.label}
							to={item.to}
							target={item.target}
							rel={item.rel}
							type={item.type}
							className='w-fit text-muted-foreground capitalize hover:text-primary'
						>
							{item.label.toLowerCase() === "atom/rss" ? "Atom/RSS" : item.label.toLowerCase()}
						</Link>
					))}
				</div>
			</nav>
		</div>
	);
}
