"use client";
import { A11yAnnouncer, A11yUserPreferences, useUserPreferences } from "@react-three/a11y";
import { Preload } from "@react-three/drei";
import { BakeShadows, Stars } from "@react-three/drei/webgpu";
import { useFrame } from "@react-three/fiber";
import { Canvas, useRenderPipeline } from "@react-three/fiber/webgpu";
import { useSearch } from "@tanstack/react-router";
import { Suspense, useEffect, useRef, useState } from "react";
import { type InstancedMesh, LinearSRGBColorSpace, Matrix4 } from "three";
import {
	attribute,
	blendScreen,
	cameraViewMatrix,
	emissive,
	Fn,
	float,
	max,
	modelWorldMatrix,
	mrt,
	mul,
	output,
	sin,
	vec2,
	vec4,
} from "three/tsl";
import type { Node } from "three/webgpu";
import CounterOverlayMin from "./counter-overlay-min";
import Neils from "./neil2";
import { useHajClickerStore } from "./store";
import { UnrealBloomNode } from "./unreal-bloom-node";

export default function BotClickerScene({ isEmbed }: { isEmbed?: boolean }) {
	// biome-ignore lint/style/noNonNullAssertion: necessary for r3f ref
	const ref = useRef(null!);
	const [windowWidth, setWindowWidth] = useState(0);
	const [viewMobile, setViewMobile] = useState(false);

	useEffect(() => {
		if (windowWidth !== window.innerWidth) {
			setWindowWidth(window.innerWidth);
		}
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [windowWidth]);

	useEffect(() => {
		if (windowWidth > 0 && windowWidth < 768) {
			setViewMobile(true);
		} else if (windowWidth >= 768) {
			setViewMobile(false);
		}
	}, [windowWidth]);

	return (
		<div
			ref={ref}
			className={`relative flex size-full min-h-136 items-center justify-center overflow-hidden ${isEmbed ? "max-h-96 max-w-7xl" : "h-dvh lg:max-h-screen"}`}
		>
			<CounterOverlayMin model='Bot' />
			<Suspense>
				<Canvas
					eventSource={ref}
					renderer={{ LinearSRGBColorSpace }}
					dpr={[1, 1.5]}
					camera={{ position: [0, 0, 10], fov: 20, near: 0.01 }}
					style={{
						height: "100%",
						width: "100%",
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						overflow: "hidden",
						pointerEvents: "none",
					}}
				>
					<A11yUserPreferences>
						<BotClickerMain viewMobile={viewMobile} />
					</A11yUserPreferences>
					<Preload all />
				</Canvas>
				<A11yAnnouncer />
			</Suspense>
		</div>
	);
}

function BotClickerMain({ viewMobile }: { viewMobile: boolean }) {
	// biome-ignore lint/style/noNonNullAssertion: necessary for r3f ref
	const starRef = useRef<InstancedMesh>(null!);
	const { a11yPrefersState } = useUserPreferences();
	const searchParams = useSearch({ strict: false }) as { play?: string };
	const { clickNum } = useHajClickerStore((state) => state);
	const [playing, setPlaying] = useState(false);

	const initStars = (node: InstancedMesh | null) => {
		if (node) {
			starRef.current = node;
			if (node.instanceMatrix) {
				const dummy = new Matrix4();
				for (let i = 0; i < node.count; i++) {
					node.setMatrixAt(i, dummy);
				}
				node.instanceMatrix.needsUpdate = true;
			}
			node.frustumCulled = false;

			// FIX: Patch the Drei WebGPU Stars material scaleNode to prevent division by zero / negative depth
			// biome-ignore lint/suspicious/noExplicitAny: patching internal material
			if (node.material && !(node.material as any).userData.patched) {
				// biome-ignore lint/suspicious/noExplicitAny: patching internal material
				const material = node.material as any;
				material.userData.patched = true;

				const particleSize = attribute("size", "float");

				material.scaleNode = Fn(() => {
					const worldPos = modelWorldMatrix.mul(vec4(material.positionNode, 1));
					const viewPos = cameraViewMatrix.mul(worldPos);
					// Clamp the depth so it never hits 0 (which causes Infinity/NaN and blows out the screen)
					const depth = max(viewPos.z.negate(), 0.1);
					const distanceAttenuation = float(30).div(depth);
					const timeScale = float(3.5).add(sin(material._time.add(100)).mul(0.3));
					// @ts-expect-error: Three.js TSL typings for AttributeNode and mul() have intersection issues
					const size = mul(particleSize, distanceAttenuation).mul(timeScale).mul(0.04);
					return vec2(size);
				})();

				material.needsUpdate = true;
			}
		}
	};

	const gameSpeedCalc = () => {
		let gameSpeed = 0.1;
		if (playing) {
			gameSpeed += 7 + Math.log(clickNum >= 1 ? clickNum : 1);
			return gameSpeed;
		}
		return gameSpeed;
	};

	useFrame((_state, delta) => {
		if (!playing) {
			return;
		}
		if ((starRef.current as unknown) !== null && delta < 0.1 && !a11yPrefersState.prefersReducedMotion) {
			starRef.current.rotation.x += delta * 0.02;
			starRef.current.rotation.y -= delta * 0.005;
		}
	});

	useEffect(() => {
		if (searchParams.play === "true") {
			setPlaying(true);
		} else {
			setPlaying(false);
		}
	}, [searchParams.play]);

	return (
		<>
			<Neils viewMobile={viewMobile} speed={gameSpeedCalc()} count={viewMobile ? 30 : 60} />
			<Suspense fallback={null}>
				{searchParams.play === "true" && (
					<>
						<Stars ref={initStars} />
						<spotLight decay={1.05} power={40} position={[0, 0, 10]} />
						<BakeShadows />
						<Effects />
					</>
				)}
			</Suspense>
			<color attach='background' args={["black"]} />
			<Suspense fallback={null}>{searchParams.play !== "true" && <hemisphereLight intensity={1.4} />}</Suspense>
		</>
	);
}

function Effects() {
	useRenderPipeline(
		({ renderPipeline, passes }) => {
			if (!renderPipeline) return;
			const scenePassColor = passes.scenePass.getTextureNode().toInspector("color");
			const emissivePass = passes.scenePass.getTextureNode("emissive");

			const bloomPass = new UnrealBloomNode(emissivePass, {
				intensity: 2,
				radius: 0.85,
				luminanceThreshold: 0.2,
				luminanceSmoothing: 0.25,
				levels: 8,
				mipmapBlur: true,
			}) as unknown as Node<"vec4">;
			renderPipeline.outputNode = blendScreen(scenePassColor, bloomPass);
		},
		({ passes }) => {
			passes.scenePass.setMRT(
				mrt({
					output,
					emissive,
				}),
			);
		},
	);
	return null;
}
