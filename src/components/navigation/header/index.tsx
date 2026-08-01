import type * as React from "react";
import { Link as RACLink } from "react-aria-components";
import { Button, LinkButton } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { NavItem, SocialItem } from "./data";
import { ThemeToggleSwitch } from "./theme-toggle-switch";

export interface HeaderProps {
	navItems: NavItem[];
	socialItems: SocialItem[];
	isPost?: boolean;
	tocInView?: boolean;
	onTocToggle?: () => void;
	warnDev?: boolean;
	className?: string;
	isSticky?: boolean;
	logoLight?: React.ReactNode;
	logoDark?: React.ReactNode;
	branding?: React.ReactNode;
	productionUrl?: string;
	warnDevBannerDescription?: React.ReactNode;
	warnDevBannerReturnText?: React.ReactNode;
}

export function Header({
	navItems,
	socialItems,
	isPost = false,
	tocInView = false,
	onTocToggle,
	warnDev = false,
	className,
	isSticky = true,
	logoLight,
	logoDark,
	branding = (
		<>
			<span className="icon-[ph--leaf-fill] mr-2 size-6 text-primary" />
			<span className="hidden sm:inline-block">Lani Akita</span>
		</>
	),
	productionUrl = "https://laniakita.com",
	warnDevBannerDescription = "[WARN]: This is a dev preview. ",
	warnDevBannerReturnText = "Go to main site",
}: HeaderProps) {
	return (
		<header
			className={cn(
				"z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				isSticky && "sticky top-0",
				className,
			)}
		>
			{warnDev && productionUrl && (
				<div className="bg-destructive/10 text-destructive text-xs font-medium px-4 py-1 text-center">
					{warnDevBannerDescription}{" "}
					<RACLink
						href={productionUrl}
						className="underline underline-offset-2 hover:opacity-80 transition-opacity"
					>
						{warnDevBannerReturnText}
					</RACLink>
				</div>
			)}
			<div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
				<div className="flex items-center gap-2 md:gap-4 lg:gap-6">
					{/* Table of Contents Toggle for Posts */}
					{isPost && (
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"md:flex hidden transition-all duration-300",
								tocInView
									? "w-0 opacity-0 p-0 overflow-hidden"
									: "w-9 opacity-100",
							)}
							onPress={onTocToggle}
							aria-label="Toggle Table of Contents"
							aria-expanded={tocInView}
						>
							<span className="icon-[ph--sidebar-simple-fill] size-6 shrink-0" />
						</Button>
					)}

					{/* Logo / Brand */}
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

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-6">
						{navItems.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="flex items-center gap-2 sm:gap-4">
					{/* Social Links (Desktop) */}
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

					{/* Separator */}
					<div className="hidden sm:block h-6 w-px bg-border mx-1" />

					{/* Theme Toggle */}
					<ThemeToggleSwitch />

					{/* Mobile Menu */}
					<SheetTrigger>
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden text-muted-foreground hover:text-foreground"
							aria-label="Open menu"
						>
							<span className="icon-[ph--list] size-6" />
						</Button>
						<SheetContent side="top" className="h-[90vh]">
							<SheetHeader>
								<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-6 p-4 pt-10">
								<nav className="flex flex-col gap-6">
									{navItems.map((item) => (
										<Link
											key={item.label}
											to={item.to}
											className="text-2xl font-semibold text-foreground transition-colors hover:text-primary"
										>
											{item.label}
										</Link>
									))}
								</nav>
								<div className="h-px bg-border w-full my-6" />
								<div className="flex items-center gap-6">
									{socialItems.map((social) => (
										<LinkButton
											key={social.title}
											variant="outline"
											size="icon"
											className="rounded-full size-12"
											href={social.url}
											target="_blank"
											rel="noreferrer"
											aria-label={social.linkName}
										>
											<span className={cn(social.iconName, "size-6")} />
										</LinkButton>
									))}
								</div>
							</div>
						</SheetContent>
					</SheetTrigger>
				</div>
			</div>
		</header>
	);
}
