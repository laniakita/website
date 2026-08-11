import type * as React from "react";
import LogoDarkmode from "@/assets/laniakita-logo-transparent-darkmode.svg?react";
import LogoLightmode from "@/assets/laniakita-logo-transparent-lightmode.svg?react";
import { HeaderBanner } from "@/stories/navigation/header/banner";
import { HeaderLogo } from "@/stories/navigation/header/logo";
import { HeaderMobileMenu } from "@/stories/navigation/header/mobile-menu";
import { HeaderNav } from "@/stories/navigation/header/nav";
import { HeaderContainer, HeaderRoot } from "@/stories/navigation/header/root";
import { HeaderSocials } from "@/stories/navigation/header/socials";
import { HeaderTocToggle } from "@/stories/navigation/header/toc-toggle";
import type { NavItem, SocialItem } from "../types";

export type { NavItem, SocialItem };

import { ThemeToggleSwitch } from "./theme-toggle-switch";

/**
 * Props for the main Header component.
 */
export interface HeaderProps {
	/**
	 * Array of navigation items to display in the header and mobile menu.
	 */
	navItems: NavItem[];
	/**
	 * Array of social media links to display in the header and mobile menu.
	 */
	socialItems: SocialItem[];
	/**
	 * If true, renders the Table of Contents toggle button (only used on post pages).
	 */
	isPost?: boolean;
	/**
	 * Represents whether the table of contents is currently in view (affects the TOC toggle animation).
	 */
	tocInView?: boolean;
	/**
	 * Callback fired when the Table of Contents toggle button is pressed.
	 */
	onTocToggle?: () => void;
	/**
	 * If true, shows a development warning banner at the top of the screen.
	 */
	warnDev?: boolean;
	/**
	 * Optional class name to customize the outer `<header>` wrapper.
	 */
	className?: string;
	/**
	 * If true, the header uses `sticky top-0` to remain fixed at the top of the viewport.
	 * @default true
	 */
	isSticky?: boolean;
	/**
	 * Node to render as the logo in light mode.
	 */
	logoLight?: React.ReactNode;
	/**
	 * Node to render as the logo in dark mode.
	 */
	logoDark?: React.ReactNode;
	/**
	 * Fallback branding content displayed if logos are not provided.
	 */
	branding?: React.ReactNode;
	/**
	 * The URL to the production site used by the development warning banner.
	 */
	productionUrl?: string;
	/**
	 * Custom description text for the development warning banner.
	 */
	warnDevBannerDescription?: React.ReactNode;
	/**
	 * Custom link text for the development warning banner's return link.
	 */
	warnDevBannerReturnText?: React.ReactNode;
}

/**
 * Main Site Header Component.
 * Acts as a connected container that composes pure UI sub-components (Banner, Logo, Nav, Socials, MobileMenu)
 * to build the site's primary top navigation bar. Includes the theme toggle switch.
 */
export function Header({
	navItems,
	socialItems,
	isPost = false,
	tocInView = false,
	onTocToggle,
	warnDev = false,
	className,
	isSticky = true,
	logoLight = <LogoLightmode />,
	logoDark = <LogoDarkmode />,
	branding,
	productionUrl = "https://laniakita.com",
	warnDevBannerDescription = "[WARN]: This is a dev preview. ",
	warnDevBannerReturnText = "Go to main site",
}: HeaderProps) {
	return (
		<HeaderRoot className={className} isSticky={isSticky}>
			<HeaderBanner
				warnDev={warnDev}
				productionUrl={productionUrl}
				warnDevBannerDescription={warnDevBannerDescription}
				warnDevBannerReturnText={warnDevBannerReturnText}
			/>
			<HeaderContainer className='min-w-full'>
				<div className='flex items-center gap-2 md:gap-4 lg:gap-6'>
					<HeaderTocToggle isPost={isPost} tocInView={tocInView} onTocToggle={onTocToggle} />
					<HeaderLogo logoLight={logoLight} logoDark={logoDark} branding={branding} />
					<HeaderNav navItems={navItems} />
				</div>

				<div className='flex items-center gap-2 sm:gap-4'>
					<HeaderSocials socialItems={socialItems} />
					{/* Separator */}
					<div className='mx-1 hidden h-6 w-px bg-border sm:block' />
					<ThemeToggleSwitch />
					<HeaderMobileMenu navItems={navItems} socialItems={socialItems} className='lg:hidden' />
				</div>
			</HeaderContainer>
		</HeaderRoot>
	);
}
