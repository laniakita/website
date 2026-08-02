import type * as React from "react";

export interface SidebarProps {
	/** The component slot to render the informational section (typically InfoBox). */
	infoBoxSlot?: React.ReactNode;
	/** The component slot to render the subscription prompt (typically SubscribeBox). */
	subscribeBoxSlot?: React.ReactNode;
	/** The component slot to render social links (typically SocialBox). */
	socialBoxSlot?: React.ReactNode;
}

/**
 * A layout component for the sidebar, designed to be sticky on desktop
 * and scrollable independently of the main content.
 */
export function Sidebar({
	infoBoxSlot,
	subscribeBoxSlot,
	socialBoxSlot,
}: SidebarProps) {
	return (
		<div className="flex size-full min-h-min md:max-h-[calc(100vh-4rem)] md:sticky md:top-16 md:shadow-xl rounded-lg md:overflow-hidden">
			<div className="flex w-full flex-col gap-6 md:overflow-y-auto bg-muted/10 md:border md:p-4 rounded-lg">
				{infoBoxSlot}
				{subscribeBoxSlot}
				<div className="flex w-full flex-col items-center justify-center pb-4">
					{socialBoxSlot}
				</div>
			</div>
		</div>
	);
}
