import type * as React from "react";
import { FooterCopyright } from "@/stories/navigation/footer/copyright";
import { FooterNavBox } from "@/stories/navigation/footer/nav-box";
import { FooterBackdrop, FooterContainer, FooterContent, FooterRoot } from "@/stories/navigation/footer/root";
import { FooterSocialBox } from "@/stories/navigation/footer/social-box";
import { FooterSocialIcons } from "@/stories/navigation/footer/social-icons";
import { defaultFooterNavItems, defaultFooterSocialItems, type FooterNavItem, type FooterSocialItem } from "./data";

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
	navItems?: FooterNavItem[];
	socialItems?: FooterSocialItem[];
	startYear?: number;
	authorName?: string;
	wrapperClassName?: string;
}

/**
 * Main Site Footer Component.
 * Composes the pure UI sub-components into the main application layout.
 */
export function Footer({
	navItems = defaultFooterNavItems,
	socialItems = defaultFooterSocialItems,
	startYear = 2024,
	authorName = "Lani Akita",
	className,
	wrapperClassName,
	...props
}: FooterProps) {
	return (
		<FooterRoot className={className} wrapperClassName={wrapperClassName} {...props}>
			<FooterBackdrop>
				<FooterContainer>
					<FooterContent>
						<div className='flex w-full @xl:flex-row flex-col items-center justify-center @xl:gap-14 gap-2'>
							{/* Mobile Top Divider */}
							<div className='flex @xl:hidden w-full px-4'>
								<div className='mb-4 flex h-px w-full bg-border' />
							</div>

							{/* Social Icons Section */}
							<div className='w-full space-y-4 @xl:px-0 px-4 @xl:pl-4'>
								<FooterSocialIcons items={socialItems} />
							</div>

							{/* Desktop Vertical Divider */}
							<div className='@xl:flex hidden h-80 w-px bg-border' />

							{/* Mobile Bottom Divider */}
							<div className='flex @xl:hidden w-full px-4'>
								<div className='mt-4 flex h-px w-full bg-border' />
							</div>

							{/* Links & Socials Section */}
							<div className='relative flex size-full flex-col'>
								<div className='grid w-full @lg:grid-cols-2 grid-cols-1 @xl:gap-14 gap-4 @xl:p-0 p-4'>
									<FooterNavBox title='navigation' items={navItems} />
									<FooterSocialBox title='socials' items={socialItems} />
								</div>

								{/* Desktop Copyright Badge */}
								<div className='absolute -bottom-13 z-50 @xl:flex hidden px-2'>
									<FooterCopyright startYear={startYear} authorName={authorName} />
								</div>
							</div>

							{/* Mobile Copyright */}
							<div className='mt-4 @xl:hidden'>
								<FooterCopyright startYear={startYear} authorName={authorName} />
							</div>
						</div>
					</FooterContent>
				</FooterContainer>
			</FooterBackdrop>
		</FooterRoot>
	);
}
