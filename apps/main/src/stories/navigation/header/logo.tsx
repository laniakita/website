import type * as React from "react";
import LogoDarkmode from "@/assets/laniakita-logo-transparent-darkmode.svg?react";
import LogoLightmode from "@/assets/laniakita-logo-transparent-lightmode.svg?react";
import { Link } from "@/components/ui/link";

/**
 * Props for the HeaderLogo component.
 */
export interface HeaderLogoProps {
	/**
	 * The React node to render as the logo in light mode. Typically an `<img>` tag.
	 * If omitted, the component falls back to the `branding` prop unless both logoLight and logoDark are provided.
	 */
	logoLight?: React.ReactNode;
	/**
	 * The React node to render as the logo in dark mode. Typically an `<img>` tag.
	 * If omitted, the component falls back to the `branding` prop unless both logoLight and logoDark are provided.
	 */
	logoDark?: React.ReactNode;
	/**
	 * The fallback branding content to display if logos are not provided.
	 * Typically text and/or an icon.
	 */
	branding?: React.ReactNode;
}

/**
 * Renders the site logo or branding text, typically linked to the home page.
 * Automatically switches between `logoLight` and `logoDark` based on the active theme
 * using CSS display classes (`dark:hidden` and `hidden dark:flex`).
 */
export function HeaderLogo({
	logoLight = <LogoLightmode title='Logo Light' />,
	logoDark = <LogoDarkmode title='Logo Dark' />,
	branding = (
		<>
			<span className='icon-[ph--leaf-fill] mr-2 size-6 text-primary' />
			<span className='hidden sm:inline-block'>Lani Akita</span>
		</>
	),
}: HeaderLogoProps) {
	return (
		<Link
			to='/'
			aria-label='Home'
			className='mr-4 flex items-center font-bold text-xl tracking-tight transition-opacity hover:opacity-80'
		>
			{logoLight && logoDark ? (
				<div className='relative flex h-11 w-16 items-center'>
					<span className='absolute inset-0 flex items-center justify-center dark:hidden'>{logoLight}</span>
					<span className='absolute inset-0 hidden items-center justify-center dark:flex'>{logoDark}</span>
				</div>
			) : (
				branding
			)}
		</Link>
	);
}
