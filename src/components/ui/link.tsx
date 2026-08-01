import { createLink } from "@tanstack/react-router";
import * as React from "react";
import { type LinkProps, Link as RACLink } from "react-aria-components";
import { cn } from "@/lib/utils";

const BaseLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
	({ className, ...props }, ref) => {
		return (
			<RACLink
				ref={ref}
				{...props}
				className={(values) =>
					cn(
						"transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
						typeof className === "function" ? className(values) : className,
					)
				}
			/>
		);
	},
);
BaseLink.displayName = "BaseLink";

export const Link = createLink(BaseLink);
