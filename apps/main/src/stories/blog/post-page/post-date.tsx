import { format } from "date-fns";
import { useEffect, useState } from "react";

export interface PostDateProps {
	date: Date | string;
	tag?: boolean;
}

export function PostDate({ date, tag }: PostDateProps) {
	const [localTime, setLocalTime] = useState(format(new Date(date), "LLL do, y"));

	useEffect(() => {
		const getLocalTime = format(new Date(date), "LLL do, y");
		setLocalTime(getLocalTime);
	}, [date]);

	if (tag) {
		return <span suppressHydrationWarning>{localTime}</span>;
	}

	return (
		<time itemProp='uploadDate' dateTime={new Date(date).toISOString()} suppressHydrationWarning>
			{localTime}
		</time>
	);
}
