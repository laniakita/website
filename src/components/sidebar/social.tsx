import {
	SocialBox,
	type SocialBoxProps,
} from "$/src/stories/sidebar/social-box";

export function SidebarSocials({ className, items }: SocialBoxProps) {
	return <SocialBox className={className} items={items} />;
}
