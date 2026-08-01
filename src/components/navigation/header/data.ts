/**
 * Represents a single navigation link in the header.
 */
export interface NavItem {
	/**
	 * The display text for the navigation link.
	 */
	label: string;
	/**
	 * The destination URL or route path.
	 */
	to: string;
}

export const defaultNavItems: NavItem[] = [
	{ label: "About", to: "/about" },
	{ label: "Work", to: "/work" },
	{ label: "Atom/RSS", to: "/atom.xml" },
	{ label: "Contact", to: "/contact" },
];

/**
 * Represents a social media profile link in the header.
 */
export interface SocialItem {
	/**
	 * The internal title of the social network (e.g., "Bluesky").
	 */
	title: string;
	/**
	 * The external URL to the user's profile.
	 */
	url: string;
	/**
	 * The Iconify icon class name to render (e.g., "icon-[fa-brands--github]").
	 */
	iconName: string;
	/**
	 * An accessible name for the screen reader (e.g., "Github!").
	 */
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
