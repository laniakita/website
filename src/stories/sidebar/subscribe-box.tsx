import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/components/ui/link";

export interface SubscribeBoxProps
	extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A card component that prompts users to subscribe via an RSS/Atom feed.
 */
export function SubscribeBox({ className }: SubscribeBoxProps) {
	return (
		<Card className={className}>
			<CardContent className="flex flex-col gap-4 p-6">
				<h4 className="flex-wrap text-3xl font-black font-heading text-balance">
					Articles delivered right to your feed reader.
				</h4>
				<Link
					target="_blank"
					to="/atom.xml"
					type="application/atom+xml"
					className="font-mono font-bold hover:no-underline text-primary-foreground"
				>
					<div className="flex w-full flex-row items-center justify-center gap-[1ch] rounded bg-primary px-4 py-2 hover:bg-primary/90 transition-colors">
						<span>subscribe</span>
						<span>|</span>
						<span className="flex flex-row items-center gap-1">
							<span className="icon-[ph--atom] text-2xl" />{" "}
							<span className="icon-[ph--rss] text-2xl" />
						</span>
					</div>
				</Link>
			</CardContent>
		</Card>
	);
}
