import type { AnchorHTMLAttributes } from "react";
import { Link } from "@/components/ui/link";

export default function Anchors(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
	if (props.href) {
		const re = /(?:https:\/\/)/;
		const re2 = /(?:http:\/\/)/;

		if (re.test(props.href) || re2.test(props.href)) {
			return <a {...props} target='_blank' rel='noopener noreferrer nofollow' />;
		}
	}

	if (props.href?.includes("#")) {
		return <a href={props.href} {...props} />;
	} else {
		// biome-ignore lint/suspicious/noExplicitAny: too dynamic.
		return <Link to={props.href as any} {...(props as any)} />;
	}
}
