import type * as React from "react";
import { cn } from "@/lib/utils";

export interface FooterCopyrightProps extends React.HTMLAttributes<HTMLDivElement> {
	startYear?: number;
	currentYear?: number;
	authorName?: string;
}

export function FooterCopyright({
	startYear = 2024,
	currentYear = new Date().getFullYear(),
	authorName = "Lani Akita",
	className,
	...props
}: FooterCopyrightProps) {
	const yearDisplay = startYear === currentYear ? currentYear : `${startYear}-${currentYear}`;

	return (
		<div className={cn("text-xs", className)} {...props}>
			<p className='text-balance text-center text-muted-foreground'>
				© {yearDisplay} {authorName}. All Rights Reserved.
			</p>
		</div>
	);
}
