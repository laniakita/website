// source: https://github.com/fuma-nama/fumadocs/blob/7c31d84c1c0ed54fea193abc089b6b16556cd315/packages/base-ui/src/utils/use-copy-button.ts

"use client";
import {
	type MouseEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export function useCopyButton(
	onCopy: () => void | Promise<void>,
): [checked: boolean, onClick: MouseEventHandler] {
	const [checked, setChecked] = useState(false);
	const callbackRef = useRef(onCopy);
	const timeoutRef = useRef<number | null>(null);

	callbackRef.current = onCopy;

	const onClick: MouseEventHandler = useCallback(() => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		const res = Promise.resolve(callbackRef.current());

		void res.then(() => {
			setChecked(true);
			timeoutRef.current = window.setTimeout(() => {
				setChecked(false);
			}, 1500);
		});
	}, []);

	// Avoid updates after being unmounted
	useEffect(() => {
		return () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		};
	}, []);

	return [checked, onClick];
}
