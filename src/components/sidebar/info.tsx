import { InfoBox, type InfoBoxProps } from "$/src/stories/sidebar/info-box";

export function SidebarInfo({
	className,
	blogInfo,
	categories,
	tags,
}: InfoBoxProps) {
	return (
		<InfoBox
			className={className}
			blogInfo={blogInfo}
			categories={categories}
			tags={tags}
		/>
	);
}
