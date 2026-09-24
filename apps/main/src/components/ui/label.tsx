"use client";

import { cn } from "cn";
import { LabelContext, Label as LabelPrimitive, type LabelProps } from "react-aria-components";

function Label({ className, htmlFor, slot, ...props }: LabelProps) {
	const label = (
		<LabelPrimitive
			data-slot='label'
			className={cn(
				"flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-data-disabled:opacity-50",
				className,
			)}
			{...props}
			htmlFor={htmlFor}
			slot={slot}
		/>
	);

	if (htmlFor && slot === undefined) {
		return <LabelContext.Provider value={null}>{label}</LabelContext.Provider>;
	}

	return label;
}

export { Label };
