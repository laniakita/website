"use client";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import { Suspense, useState } from "react";
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
						<div className='ctp-mocha pointer-events-none absolute right-4 bottom-4 z-2 flex w-fit touch-none flex-col items-end gap-2 -space-y-4 text-right text-ctp-text lg:right-10 lg:bottom-10'>
							<p className='font-black text-xl uppercase'>{`${model} Clicker Counter`}</p>
							<p className='font-black text-3xl text-ctp-mauve'>{String(clickNum).padStart(11, "0")}</p>
						</div>
						<button
							type='button'
							onClick={() => {
								navigate({ to: location.pathname, search: (prev: any) => ({ ...prev, play: undefined }) });
							}}
							className='ctp-mocha absolute top-4 left-4 z-2 border border-ctp-surface0 bg-ctp-midnight px-4 py-1 backdrop-blur-sm hover:border-ctp-mauve hover:bg-ctp-mauve hover:text-ctp-base lg:top-10 lg:left-10'
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
							<div className='absolute inset-0 z-10 flex h-full items-center justify-center bg-ctp-midnight/30 backdrop-blur-xl'>
								<div className='flex max-w-xs flex-col items-center justify-center gap-10 md:max-w-md'>
									<div className='font-black text-sm uppercase md:text-base'>
										{`EPILEPSY WARNING: Bot Clicker features flashing lights and sounds that may cause an epileptic seizure! Do not
                play Bot Clicker if you've ever been diagnosed with and or believe you might have EPILEPSY.`}
									</div>
									<div className='flex w-full flex-row items-center justify-between gap-4 text-ctp-base'>
										<button
											onClick={(): void => {
												setIsPlayWarn(false);
												navigate({ to: location.pathname, search: (prev: any) => ({ ...prev, play: "true" }) });
											}}
											type='button'
											className='w-full rounded-full border border-ctp-surface0 bg-ctp-green/80 py-2 hover:bg-ctp-green'
										>
											Play Bot Clicker
										</button>
										<button
											onClick={() => {
												setIsPlayWarn(false);
											}}
											type='button'
											className='w-full rounded-full border border-ctp-surface0 bg-ctp-red/80 py-2 hover:bg-ctp-red'
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						)}

						<div className='ctp-mocha absolute right-4 bottom-4 z-2 flex flex-col items-end gap-4 text-ctp-text lg:right-10 lg:bottom-10'>
							<button
								onClick={() => {
									setIsPlayWarn(true);
								}}
								type='button'
								className='w-full animate-fade-in rounded-full border border-ctp-surface0 bg-ctp-midnight/80 py-2 font-mono text-ctp-mauve text-lg capitalize opacity-0 backdrop-blur-md hover:border-ctp-mauve'
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
										charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
									/>
								</h3>
								<h3 className='overflow-hidden font-black text-3xl text-ctp-red uppercase'>
									<TextSplitterUltra
										className='inline-flex'
										textIn={String(clickNum).padStart(11, "0")}
										spanRole='heading'
										level={3}
										charClass='motion-safe:animate-upDog [transform:_translateY(100%)] inline-block'
									/>
								</h3>
							</div>
						</div>
					</>
				)}
				<div className='ctp-mocha absolute bottom-4 left-4 z-2 lg:bottom-10 lg:left-10'>
					<a target='_blank' href='/credits/bot-clicker' className='underline' rel='noreferrer'>
						Credits
					</a>
				</div>
			</Suspense>
		</>
	);
}
