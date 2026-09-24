import { CircleNotchIcon } from "@phosphor-icons/react";
import { useMatchRoute } from "@tanstack/react-router";
import * as React from "react";
import { cn } from "$/src/lib/utils/cn";

export interface PendingLoaderProps {
	to: string;
	className?: string;
	onResolved?: () => void;
}

export function PendingLoader({ to, className, onResolved }: PendingLoaderProps) {
	const matchRoute = useMatchRoute();
	const isPending = !!matchRoute({ to, pending: true });

	const prevPending = React.useRef(isPending);

	React.useEffect(() => {
		if (prevPending.current && !isPending) {
			onResolved?.();
		}
		prevPending.current = isPending;
	}, [isPending, onResolved]);

	if (!isPending) return null;

	return (
		<span className='absolute -right-1 translate-x-full'>
			<CircleNotchIcon className={cn("animate-spin text-muted-foreground", className)} />
		</span>
	);
}
