export interface NavItem {
	label: string;
	to: string;
}

export const defaultNavItems: NavItem[] = [
	{ label: "About", to: "/about" },
	{ label: "Work", to: "/work" },
	{ label: "Atom/RSS", to: "/atom.xml" },
	{ label: "Contact", to: "/contact" },
];

export interface SocialItem {
	title: string;
	url: string;
	iconName: string;
	linkName: string;
}

export const defaultSocialItems: SocialItem[] = [
	{
		title: "Bluesky",
		url: "https://bsky.app/profile/laniakita.com",
		iconName: "icon-[fa6-brands--bluesky]",
		linkName: "Bluesky!",
	},
	{
		title: "Github",
		url: "https://github.com/laniakita",
		iconName: "icon-[fa-brands--github-alt]",
		linkName: "Github!",
	},
];
