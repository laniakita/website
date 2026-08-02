import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/components/ui/link";

/**
 * Defines a single social media link item.
 */
export interface SocialItem {
	/** The name of the platform (e.g., 'Github'). */
	title: string;
	/** The profile or link URL. */
	url: string;
	/** The icon class name, typically an Iconify icon class (e.g., 'icon-[fa6-brands--mastodon]'). */
	iconName: string;
	/** A descriptive name used for accessibility (e.g., 'Github!'). */
	linkName: string;
	/** Optional specific text size utility class for the icon. */
	textSize?: string;
}

export interface SocialBoxProps {
	/** An array of social media items to render. */
	items: SocialItem[];
	/** Optional CSS class name for overriding container styles. */
	className?: string;
}

/**
 * A card component that displays a grid of social media icon links.
 */
export function SocialBox({ items, className }: SocialBoxProps) {
	return (
		<Card className={className}>
			<CardContent className="p-6">
				<div className="grid grid-cols-3 gap-2">
					{items.map((item, _idx) => (
						<Link
							key={`social-${item.url}`}
							rel={item.title.toLowerCase() === "mastodon" ? "me" : undefined}
							to={item.url}
							className="flex basis-full items-center justify-center rounded border border-border p-2 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							target="_blank"
							aria-label={`Follow on ${item.linkName}`}
							type={
								item.url === "/atom.xml" ? "application/atom+xml" : undefined
							}
						>
							<span
								className={`${item.iconName} ${item.textSize ?? "text-2xl md:text-3xl"}`}
							/>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
