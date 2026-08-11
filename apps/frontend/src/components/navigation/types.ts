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
	/**
	 * Target window for link navigation (e.g. "_blank").
	 */
	target?: string;
	/**
	 * Relationship between current page and target resource (e.g. "alternate").
	 */
	rel?: string;
	/**
	 * The MIME media type of the target resource (e.g. "application/atom+xml").
	 */
	type?: string;
}

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
