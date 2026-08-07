"use client";

import { createLink } from "@tanstack/react-router";
import * as React from "react";
import { type LinkProps, Link as RACLink } from "react-aria-components";
import { cn } from "@/lib/utils";

export interface BaseLinkProps extends LinkProps {
	/** The MIME media type of the linked resource */
	type?: string;
}

const BaseLink = React.forwardRef<HTMLAnchorElement, BaseLinkProps>(({ className, ...props }, ref) => {
	return (
		<RACLink
			ref={ref}
			{...props}
			className={(values) =>
				cn(
					"links ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					typeof className === "function" ? className(values) : className,
				)
			}
		/>
	);
});
BaseLink.displayName = "BaseLink";

export const Link = createLink(BaseLink);
