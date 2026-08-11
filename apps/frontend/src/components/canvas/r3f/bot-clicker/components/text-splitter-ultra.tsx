import type { ComponentProps } from "react";

interface TextSplitterUltraProps extends ComponentProps<"span"> {
	textIn: string;
	spanRole: string;
	level: number;
	charClass: string;
}

export default function TextSplitterUltra({
	textIn,
	spanRole,
	charClass,
	level,
	...spanProps
}: TextSplitterUltraProps) {
	return (
		<span role={spanRole} {...spanProps}>
			{/* Visually hidden text for screen readers */}
			<span className='sr-only'>{textIn}</span>

			{/* Split characters hidden from screen readers to prevent reading letter-by-letter */}
			{textIn.split("").map((char, index) => {
				return (
					<span
						key={char}
						aria-hidden='true'
						className={`${char === " " ? "mx-[0.2rem]" : ""} ${charClass}`}
						style={{ animationDelay: `${0.5 + index / 10}s` }}
					>
						{char}
					</span>
				);
			})}
		</span>
	);
}
