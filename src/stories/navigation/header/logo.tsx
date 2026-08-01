import type * as React from "react";
import logoDarkmode from "@/assets/laniakita-logo-darkmode.png";
import logoLightmode from "@/assets/laniakita-logo-lightmode.png";
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
	logoLight = <img src={logoLightmode} alt="Logo Light" />,
	logoDark = <img src={logoDarkmode} alt="Logo Dark" />,
	branding = (
		<>
			<span className="icon-[ph--leaf-fill] mr-2 size-6 text-primary" />
			<span className="hidden sm:inline-block">Lani Akita</span>
		</>
	),
}: HeaderLogoProps) {
	return (
		<Link
			to="/"
			className="font-bold text-xl tracking-tight mr-4 flex items-center hover:opacity-80 transition-opacity"
		>
			{logoLight && logoDark ? (
				<div className="relative flex items-center h-11 w-16">
					<span className="dark:hidden absolute inset-0 flex items-center justify-center">
						{logoLight}
					</span>
					<span className="hidden dark:flex absolute inset-0 items-center justify-center">
						{logoDark}
					</span>
				</div>
			) : (
				branding
			)}
		</Link>
	);
}
