import type { ReactNode } from "react";
import { Sidebar } from "$/src/stories/sidebar/sidebar";
import { sidebarSocialItems } from "./data";
import { SidebarInfo } from "./info";
import { SidebarSocials } from "./social";
import { SidebarSubscribe } from "./subscribe";

export interface BlogSidebarProps {
	categories: {
		title: string;
		url: string;
	}[];
	tags: {
		title: string;
		url: string;
	}[];
	info?: ReactNode;
}

export function BlogSidebar({ categories, tags, info }: BlogSidebarProps) {
	return (
		<Sidebar
			infoBoxSlot={
				<SidebarInfo
					categories={categories}
					tags={tags}
					blogInfo={info}
					className="min-h-min"
				/>
			}
			socialBoxSlot={
				<SidebarSocials
					items={sidebarSocialItems}
					className="min-h-min w-full py-0"
				/>
			}
			subscribeBoxSlot={<SidebarSubscribe className="min-h-min" />}
		/>
	);
}
