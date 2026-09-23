"use client";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils/cn";
import styles from "./bot-clicker.module.css";
import TextSplitterUltra from "./components/text-splitter-ultra";
import { useHajClickerStore } from "./store";

export default function CounterOverlayMin({ model }: { model: string }) {
	const [isPlayWarn, setIsPlayWarn] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const searchParams = useSearch({ strict: false }) as { play?: string };
	const { clickNum } = useHajClickerStore((state) => state);

	return (
		<>
			<Suspense>
				{searchParams.play === "true" && (
					<>
						<div
							className={cn(
								"pointer-events-none absolute right-4 bottom-4 z-2 flex w-fit touch-none flex-col items-end gap-2 -space-y-4 text-right lg:right-10 lg:bottom-10",
								styles.mocha,
								styles.counterContainer,
							)}
						>
							<p className='font-black text-xl uppercase'>{`${model} Clicker Counter`}</p>
							<p className={cn("font-black text-3xl", styles.counterValue)}>{String(clickNum).padStart(11, "0")}</p>
						</div>
						<button
							type='button'
							onClick={() => {
								// biome-ignore lint/suspicious/noExplicitAny: necessary due to dynamic search params
								navigate({ to: location.pathname, search: (prev: any) => ({ ...prev, play: undefined }) });
							}}
							className={cn(
								"absolute top-4 left-4 z-2 border px-4 py-1 backdrop-blur-sm lg:top-10 lg:left-10",
								styles.mocha,
								styles.backButton,
							)}
						>
							back
						</button>
					</>
				)}
			</Suspense>
			<Suspense>
				{searchParams.play !== "true" && (
					<>
						{/* safety blur + play button + warn menu */}
						<div className='absolute inset-0 z-1 h-full bg-black/30 backdrop-blur-xl' />
						{(isPlayWarn as unknown) === true && (
							<div
								className={cn(
									"absolute inset-0 z-10 flex h-full items-center justify-center backdrop-blur-xl",
									styles.warningContainer,
								)}
							>
								<div className='flex max-w-xs flex-col items-center justify-center gap-10 md:max-w-md'>
									<div className='font-black text-sm uppercase md:text-base'>
										{`EPILEPSY WARNING: Bot Clicker features flashing lights and sounds that may cause an epileptic seizure! Do not
                play Bot Clicker if you've ever been diagnosed with and or believe you might have EPILEPSY.`}
									</div>
									<div className={cn("flex w-full flex-row items-center justify-between gap-4", styles.warningText)}>
										<button
											onClick={(): void => {
												setIsPlayWarn(false);
												// biome-ignore lint/suspicious/noExplicitAny: necessary due to dynamic search params
												navigate({ to: location.pathname, search: (prev: any) => ({ ...prev, play: "true" }) });
											}}
											type='button'
											className={cn("w-full rounded-full border py-2", styles.playButtonWarning)}
										>
											Play Bot Clicker
										</button>
										<button
											onClick={() => {
												setIsPlayWarn(false);
											}}
											type='button'
											className={cn("w-full rounded-full border py-2", styles.cancelButtonWarning)}
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						)}

						<div
							className={cn(
								"absolute right-4 bottom-4 z-2 flex flex-col items-end gap-4 lg:right-10 lg:bottom-10",
								styles.mocha,
								styles.counterContainer,
							)}
						>
							<button
								onClick={() => {
									setIsPlayWarn(true);
								}}
								type='button'
								className={cn(
									"w-full rounded-full border py-2 font-mono text-lg capitalize opacity-0 backdrop-blur-md",
									styles.playButtonMain,
									styles.animateFadeIn,
								)}
							>
								play bot clicker
							</button>
							<div className='pointer-events-none flex w-fit touch-none flex-col -space-y-2 text-right'>
								<h3 className='overflow-hidden font-black text-xl uppercase'>
									<TextSplitterUltra
										className='inline-flex'
										textIn={`${model} Clicker Counter`}
										spanRole='heading'
										level={3}
										charClass={cn("inline-block [transform:_translateY(100%)]", styles.animateUpDog)}
									/>
								</h3>
								<h3 className={cn("overflow-hidden font-black text-3xl uppercase", styles.counterValueRed)}>
									<TextSplitterUltra
										className='inline-flex'
										textIn={String(clickNum).padStart(11, "0")}
										spanRole='heading'
										level={3}
										charClass={cn("inline-block [transform:_translateY(100%)]", styles.animateUpDog)}
									/>
								</h3>
							</div>
						</div>
					</>
				)}
				<div className={cn("absolute bottom-4 left-4 z-2 lg:bottom-10 lg:left-10", styles.mocha)}>
					<Link
						target='_blank'
						// biome-ignore lint/suspicious/noExplicitAny: necessary for dynamic info routes
						to={"/credits/bot-clicker" as any}
						className='underline'
						rel='noreferrer'
					>
						Credits
					</Link>
				</div>
			</Suspense>
		</>
	);
}
