import type { NavItem } from "@/components/navigation/header";
import { Link } from "@/components/ui/link";
import { PendingLoader } from "./pending-loader";
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
		<nav className='@4xl/navbar:flex hidden items-center gap-6'>
			{navItems.map((item) => (
				<Link
					key={item.label}
					to={item.to}
					target={item.target}
					rel={item.rel}
					type={item.type}
					className='relative flex items-center font-medium text-muted-foreground text-sm capitalize transition-colors hover:text-foreground'
				>
					{item.label}
					<PendingLoader to={item.to} className='m-0 size-3 p-0' />
				</Link>
			))}
		</nav>
	);
}
