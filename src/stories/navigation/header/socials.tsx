import type { SocialItem } from "@/components/navigation/header/data";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for the HeaderSocials component.
 */
export interface HeaderSocialsProps {
	/**
	 * An array of social media profiles including their URLs, icon names, and accessibility labels.
	 */
	socialItems: SocialItem[];
}

/**
 * Desktop social links component that renders a row of icon buttons.
 * Visible on small screens and up (`sm:flex`), hidden on extra small screens.
 */
export function HeaderSocials({ socialItems }: HeaderSocialsProps) {
	if (!socialItems || socialItems.length === 0) return null;

	return (
		<div className="hidden sm:flex items-center gap-1">
			{socialItems.map((social) => (
				<LinkButton
					key={social.title}
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground"
					href={social.url}
					target="_blank"
					rel="noreferrer"
					aria-label={social.linkName}
				>
					<span className={cn(social.iconName, "size-5")} />
				</LinkButton>
			))}
		</div>
	);
}
