import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";

/**
 * Represents a single category or tag item.
 */
export enum CatTagType {
	Category = "category",
	Tag = "tag",
}

export interface CatTag {
	/** The display title of the category or tag. */
	title: string;
	/** The URL path to navigate to when clicked. */
	url: string;
	/** Identifies whether this item is a Category or a Tag for styling purposes. */
	type: CatTagType | `${CatTagType}`;
}

export interface CatTagRollerProps {
	/** An array of category items to display. */
	cats?: CatTag[];
	/** An array of tag items to display. */
	tags?: CatTag[];
}

/**
 * A component that displays a list of categories and tags as inline badges.
 * Categories are typically highlighted, while tags use a secondary style.
 */
export function CatTagRoller({ cats = [], tags = [] }: CatTagRollerProps) {
	cats.forEach((t) => {
		t.type = CatTagType.Category;
	});
	tags.forEach((t) => {
		t.type = CatTagType.Tag;
	});

	const combined = [...cats, ...tags];

	if (combined.length === 0) return null;

	return (
		<div className='flex flex-wrap gap-2 font-mono text-sm'>
			{combined.map((item, _idx) => (
				<Link key={`${item.type}-${item.title}-${item.url}`} to={item.url} className='no-underline hover:no-underline'>
					<Badge variant={item.type === CatTagType.Tag ? "secondary" : "default"} className='cursor-pointer'>
						{item.type === CatTagType.Tag ? "#" : ""}
						{item.title}
					</Badge>
				</Link>
			))}
		</div>
	);
}
