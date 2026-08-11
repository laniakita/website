import { MatchRoute } from "@tanstack/react-router";
import { Dialog, Popover as PopoverPrimitive } from "react-aria-components";
import type { NavItem, SocialItem } from "@/components/navigation/header";
import { Button, LinkButton } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "$/src/lib/utils/cn";
import { PendingLoader } from "./pending-loader";
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

function MobileMenuContent({
	navItems,
	socialItems,
	close,
}: {
	navItems: NavItem[];
	socialItems: SocialItem[];
	close: () => void;
}) {
	return (
		<div className='flex h-full flex-col gap-6 p-6 pt-10'>
			<nav className='flex flex-col gap-6'>
				{navItems.map((item) => (
					<MatchRoute key={item.label} to={item.to}>
						{(activeMatch) => (
							<Link
								to={item.to}
								target={item.target}
								rel={item.rel}
								type={item.type}
								className='relative flex w-fit items-center gap-3 font-semibold text-3xl text-foreground capitalize transition-colors hover:text-primary'
								onPress={() => {
									if (activeMatch || item.target === "_blank") {
										close();
									}
								}}
							>
								{item.label}
								<PendingLoader to={item.to} className='size-6' onResolved={close} />
							</Link>
						)}
					</MatchRoute>
				))}
			</nav>
			<div className='my-2 h-px w-full bg-border' />
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
						onPress={close}
					>
						<span className={cn(social.iconName, "size-6")} />
					</LinkButton>
				))}
			</div>
		</div>
	);
}

/**
 * Mobile navigation menu component utilizing a Popover layout.
 * Displays navigation links and social icons when triggered via a hamburger menu button.
 * The trigger button is visible only on smaller screens (controlled by `className` passed from parent).
 */
export function HeaderMobileMenu({ navItems, socialItems, className }: HeaderMobileMenuProps) {
	return (
		<PopoverTrigger>
			<Button
				variant='ghost'
				size='icon'
				className={cn("group text-muted-foreground hover:text-foreground", className)}
				aria-label='Open menu'
			>
				<span className='pointer-events-none flex size-fit flex-col items-center justify-center gap-1'>
					<span className='h-[0.15rem] w-6 rounded-full bg-current group-aria-expanded:translate-y-1.5 group-aria-expanded:rotate-[-40deg] motion-safe:transition-transform' />
					<span className='h-[0.15rem] w-6 rounded-full bg-current duration-150 group-aria-expanded:opacity-0 motion-safe:transition-opacity' />
					<span className='h-[0.15rem] w-6 rounded-full bg-current group-aria-expanded:-translate-y-1.5 group-aria-expanded:rotate-40 motion-safe:transition-transform' />
				</span>
			</Button>
			<PopoverPrimitive
				placement='bottom end'
				containerPadding={0}
				offset={16}
				crossOffset={0}
				className='data-entering:fade-in-0 data-exiting:fade-out-0 z-50 h-[calc(100dvh-4rem)] w-full max-w-full rounded-none border-x-0 border-b-0 bg-background/95 backdrop-blur-md duration-200 data-entering:animate-in data-exiting:animate-out dark:bg-background/95'
			>
				<Dialog aria-label='Navigation Menu' className='h-full w-full outline-none'>
					{({ close }) => <MobileMenuContent navItems={navItems} socialItems={socialItems} close={close} />}
				</Dialog>
			</PopoverPrimitive>
		</PopoverTrigger>
	);
}
