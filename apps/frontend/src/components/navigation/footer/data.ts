import { SOCIALS_FULL } from "../../nav-constants";

export interface FooterNavItem {
	label: string;
	to: string;
	target?: string;
	rel?: string;
	type?: string;
}

export interface FooterSocialItem {
	title: string;
	url: string;
	iconName: string;
	linkName: string;
	textSize: string;
}

export const defaultFooterNavItems: FooterNavItem[] = [
	{ label: "Home", to: "/" },
	{ label: "About", to: "/about" },
	{ label: "Work", to: "/work" },
	{ label: "Blog", to: "/blog" },
	{ label: "Credits", to: "/credits" },
];

export const defaultFooterSocialItems: FooterSocialItem[] = SOCIALS_FULL;
