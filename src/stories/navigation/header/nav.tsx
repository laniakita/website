import type { NavItem } from "@/components/navigation/header/data";
import { Link } from "@/components/ui/link";

/**
 * Props for the HeaderNav component.
 */
export interface HeaderNavProps {
	/**
	 * An array of navigation items containing labels and destination URLs.
	 */
	navItems: NavItem[];
}

/**
 * Desktop navigation component that renders a list of links.
 * Visible only on large screens (`lg:flex`), hidden on mobile.
 */
export function HeaderNav({ navItems }: HeaderNavProps) {
	return (
		<nav className="hidden lg:flex items-center gap-6">
			{navItems.map((item) => (
				<Link
					key={item.label}
					to={item.to}
					className="z-51 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					{item.label}
				</Link>
			))}
		</nav>
	);
}
