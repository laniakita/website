"use client";
import { type DetailedHTMLProps, type HTMLAttributes, Suspense } from "react";
import SectionCore from "./section";

export default function Section(
	props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
) {
	return (
		<Suspense fallback={<section {...props} />}>
			<SectionCore {...props} />
		</Suspense>
	);
}
