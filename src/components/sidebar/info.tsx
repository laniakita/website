import { InfoBox, type InfoBoxProps } from "@/stories/sidebar/info-box";

export function SidebarInfo({
	className,
	blogInfo = <p>A blog about life, systems, and programming. Written by Lani Akita.</p>,
	categories,
	tags,
}: InfoBoxProps) {
	return <InfoBox className={className} blogInfo={blogInfo} categories={categories} tags={tags} />;
}
