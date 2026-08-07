import type { NavItem, SocialItem } from "@/components/navigation/header/data";
import { Button, LinkButton } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Props for the HeaderMobileMenu component.
 */
export interface HeaderMobileMenuProps {
	/**
	 * An array of navigation items to display in the mobile menu.
	 */
	navItems: NavItem[];
	/**
	 * An array of social media profiles to display in the mobile menu.
	 */
	socialItems: SocialItem[];
	/**
	 * Optional class name for the trigger button.
	 */
	className?: string;
}

/**
 * Mobile navigation menu component utilizing a slide-out Sheet (dialog) layout.
 * Displays navigation links and social icons when triggered via a hamburger menu button.
 * The trigger button is visible only on smaller screens (controlled by `className` passed from parent).
 */
export function HeaderMobileMenu({ navItems, socialItems, className }: HeaderMobileMenuProps) {
	return (
		<SheetTrigger>
			<Button
				variant='ghost'
				size='icon'
				className={cn("text-muted-foreground hover:text-foreground", className)}
				aria-label='Open menu'
			>
				<span className='icon-[ph--list] size-6' />
			</Button>
			<SheetContent side='top' className='h-[90vh]'>
				<SheetHeader>
					<SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
				</SheetHeader>
				<div className='flex flex-col gap-6 p-4 pt-10'>
					<nav className='flex flex-col gap-6'>
						{navItems.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								className='font-semibold text-2xl text-foreground transition-colors hover:text-primary'
							>
								{item.label}
							</Link>
						))}
					</nav>
					<div className='my-6 h-px w-full bg-border' />
					<div className='flex items-center gap-6'>
						{socialItems.map((social) => (
							<LinkButton
								key={social.title}
								variant='outline'
								size='icon'
								className='size-12 rounded-full'
								href={social.url}
								target='_blank'
								rel='noreferrer'
								aria-label={social.linkName}
							>
								<span className={cn(social.iconName, "size-6")} />
							</LinkButton>
						))}
					</div>
				</div>
			</SheetContent>
		</SheetTrigger>
	);
}
