"use client";
import {
	Children,
	type DetailedHTMLProps,
	type HTMLAttributes,
	type LiHTMLAttributes,
	type ReactElement,
	useEffect,
	useRef,
	useState,
} from "react";
import { useHash } from "@/components/use-hash";

export default function SectionCore(
	props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	if (ready && props.className === "footnotes") {
		return <SectionFn {...props} />;
	}
	return <section {...props} />;
}

function SectionFn(
	props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
) {
	const liRef = useRef<HTMLLIElement>(null);
	const { hash } = useHash();

	// biome-ignore lint/suspicious/noExplicitAny: nodes can be anything
	const children = Children.toArray(props.children) as ReactElement<any>[];
	const h2 =
		children.find((c) => c.type === "h2" || c.props?.id === "footnote-label") ||
		children[0];
	const ol =
		children.find(
			(c) =>
				c.type === "ol" ||
				c.props?.nodeName === "OL" ||
				(c.props?.children &&
					Array.isArray(c.props.children) &&
					c.props.children[0]?.type === "li"),
		) || children[children.length - 1];

	const currList = ol?.props?.children;
	const listItems = Children.toArray(currList) as ReactElement<HTMLLIElement>[];

	return (
		<section {...props}>
			{h2}
			<ol>
				{listItems.map((item) =>
					item.props ? (
						<li
							key={item.props.id}
							ref={liRef}
							{...(item.props as unknown as LiHTMLAttributes<HTMLLIElement>)}
							className={`relative ${hash.substring(1) === item.props.id ? "after:pointer-events-none after:absolute after:-inset-y-2 after:-right-4 after:-left-10 after:rounded-lg after:border after:border-ctp-mauve after:bg-ctp-mauve/20 after:opacity-100 after:transition-opacity after:duration-500" : "after:opacity-0"}`}
						/>
					) : (
						""
					),
				)}
			</ol>
		</section>
	);
}
