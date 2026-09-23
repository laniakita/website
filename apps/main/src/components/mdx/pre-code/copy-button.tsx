import { type Dispatch, type RefObject, type SetStateAction, useId } from "react";
import { Button } from "../../ui/button";

export const handlePreScrollDefault = (btnRef: RefObject<HTMLButtonElement | null>) => {
	if (btnRef?.current) {
		btnRef.current.style.opacity = "0";
		setTimeout(() => {
			if (btnRef.current) btnRef.current.style.opacity = "100%";
		}, 500);
	}
};

export const handlePreScroll = (
	btnRef: RefObject<HTMLButtonElement | null>,
	insideCollapsedBlock?: boolean,
	isExpanded?: boolean,
) => {
	if (btnRef?.current) {
		if (!insideCollapsedBlock || isExpanded === true) {
			btnRef.current.style.pointerEvents = "none";
			btnRef.current.style.opacity = "0";
			setTimeout(() => {
				if (btnRef.current) {
					btnRef.current.style.pointerEvents = "auto";
					btnRef.current.style.opacity = "100%";
				}
			}, 500);
		} else if (insideCollapsedBlock && !isExpanded) {
			btnRef.current.style.opacity = "0";
			setTimeout(() => {
				if (btnRef.current) btnRef.current.style.opacity = "20%";
			}, 500);
		}
	}
};

export default function CopyBtn({
	preRef,
	btnRef,
	setIsCopied,
	topPos,
	isCopied,
	special,
	isExpanded,
}: {
	preRef: RefObject<HTMLPreElement | null>;
	btnRef: RefObject<HTMLButtonElement | null>;
	setIsCopied: Dispatch<SetStateAction<boolean | null>>;
	topPos?: string;
	isCopied: boolean | null;
	special?: string;
	isExpanded?: boolean;
}) {
	const getId = useId();
	const handleCopyClick = () => {
		const code = preRef.current?.innerText;
		if (code) {
			navigator.clipboard.writeText(code);
			setIsCopied(true);
			console.log("copied code to clipboard");
		} else {
			setIsCopied(null);
			console.error("error: failed to copy code to clipboard (<pre/>.innerText not found)");
		}
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};
	return (
		<div
			id={`code-snippet-copy-button-overlay${getId}`}
			className={`pointer-events-none absolute inset-x-0 inline-flex w-full flex-row items-center justify-end ${topPos ?? "top-2"} my-0 gap-4 motion-safe:[transition:top_0.3s]`}
		>
			<span
				className={`pointer-events-none flex min-w-2 rounded-full border border-ctp-base p-1 px-4 font-bold font-mono opacity-0 backdrop-blur-md motion-safe:[transition:opacity_0.3s] ${isCopied ? "pointer-events-auto border-ctp-green bg-ctp-green/20 text-ctp-green opacity-100 hover:border-ctp-green hover:bg-ctp-green/20 hover:text-ctp-green" : isCopied === null ? "pointer-events-auto border-ctp-red bg-ctp-red/20 text-ctp-red opacity-100 hover:border-ctp-red hover:bg-ctp-red/20 hover:text-ctp-red" : ""} text-xs md:text-base`}
			>
				{isCopied ? "Copied to clipboard!" : isCopied === null ? "Error: Copying failed." : ""}
			</span>

			<Button
				aria-label='Copy codeblock to clipboard'
				ref={btnRef}
				onClick={handleCopyClick}
				className={`${special} mr-4 flex items-center justify-center rounded-lg border p-1 shadow-lg backdrop-blur-sm hover:shadow-xl hover:backdrop-blur motion-safe:[transition:color_0.3s,border_0.3s,box-shadow_0.3s,backdrop-filter_0.3s,background_0.3s,opacity_0.3s] ${isExpanded === true && "pointer-events-auto opacity-100"} ${isExpanded === false && isExpanded !== undefined && "pointer-events-none opacity-20"} ${isCopied ? "border-ctp-green/99 bg-ctp-green/20 text-ctp-green/99 hover:border-ctp-green hover:bg-ctp-green/20 hover:text-ctp-green" : isCopied === null ? "border-ctp-red bg-ctp-red/20 text-ctp-red hover:border-ctp-red hover:bg-ctp-red/20 hover:text-ctp-red" : "border-primary bg-primary/10 text-primary hover:border-primary-light hover:bg-primary-light/10 hover:text-primary-light"}`}
			>
				<span
					className={`${isCopied ? "icon-[ph--check-fat-duotone] text-ctp-green hover:text-ctp-green" : isCopied === null ? "icon-[ph--x-circle-duotone] text-ctp-red hover:text-ctp-red" : "icon-[ph--copy-duotone]"} size-6`}
				/>
			</Button>
		</div>
	);
}
