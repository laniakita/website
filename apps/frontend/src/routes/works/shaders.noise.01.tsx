import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const NoiseShader01 = lazy(() => {
	if (import.meta.env.SSR) {
		return Promise.resolve({ default: () => <></> });
	}
	return import("@/components/canvas/r3f/shaders/noise/01/noise");
});

export const Route = createFileRoute("/works/shaders/noise/01")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className='relative h-dvh w-full'>
			<div className='absolute inset-0'>
				<Suspense fallback={null}>
					<NoiseShader01 />
				</Suspense>
			</div>
		</div>
	);
}
