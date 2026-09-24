import {
	Fn,
	luminance,
	mix,
	mul,
	nodeObject,
	passTexture,
	smoothstep,
	texture,
	uniform,
	uv,
	vec2,
	vec4,
} from "three/tsl";
import {
	HalfFloatType,
	type NodeBuilder,
	type NodeFrame,
	NodeMaterial,
	NodeUpdateType,
	QuadMesh,
	RendererUtils,
	RenderTarget,
	TempNode,
	Vector2,
} from "three/webgpu";

// biome-ignore lint/suspicious/noExplicitAny: QuadMesh typing in Three 0.186
const _quadMesh = new QuadMesh(undefined as any);
const _size = new Vector2();

// biome-ignore lint/suspicious/noExplicitAny: TSL types are highly dynamic
type TSLAny = any;

let _rendererState: TSLAny;

const luminosityHighPass = Fn((props: TSLAny) => {
	const { input, threshold, smoothWidth } = props;
	const v = luminance((input as TSLAny).rgb);
	const alpha = smoothstep(threshold, (threshold as TSLAny).add(smoothWidth), v);
	return mix(vec4(0), input as TSLAny, alpha);
});

// 13-tap Downsample Filter (Froyok / UE4)
const downsamplePass = Fn((props: TSLAny) => {
	const { src, invSize } = props;
	const uvNode = uv();
	const x = (invSize as TSLAny).x;
	const y = (invSize as TSLAny).y;

	const sampleTex = (u: TSLAny, v: TSLAny) => texture(src as TSLAny, uvNode.add(vec2(u, v))).rgb;

	const a = sampleTex(mul(x, -2.0), mul(y, 2.0));
	const b = sampleTex(0.0, mul(y, 2.0));
	const c = sampleTex(mul(x, 2.0), mul(y, 2.0));

	const d = sampleTex(mul(x, -2.0), 0.0);
	const e = sampleTex(0.0, 0.0);
	const f = sampleTex(mul(x, 2.0), 0.0);

	const g = sampleTex(mul(x, -2.0), mul(y, -2.0));
	const h = sampleTex(0.0, mul(y, -2.0));
	const i = sampleTex(mul(x, 2.0), mul(y, -2.0));

	const j = sampleTex(mul(x, -1.0), y);
	const k = sampleTex(x, y);
	const l = sampleTex(mul(x, -1.0), mul(y, -1.0));
	const m = sampleTex(x, mul(y, -1.0));

	let sum = e.mul(0.125);
	sum = sum.add(a.add(c).add(g).add(i).mul(0.03125));
	sum = sum.add(b.add(d).add(f).add(h).mul(0.0625));
	sum = sum.add(j.add(k).add(l).add(m).mul(0.125));

	return vec4(sum, 1.0);
});

// 9-tap 3x3 Tent Upsample Filter (Froyok / UE4)
const upsamplePass = Fn((props: TSLAny) => {
	const { src, invSize, radius } = props;
	const uvNode = uv();
	const x = (invSize as TSLAny).x.mul(radius);
	const y = (invSize as TSLAny).y.mul(radius);

	const sampleTex = (u: TSLAny, v: TSLAny) => texture(src as TSLAny, uvNode.add(vec2(u, v))).rgb;

	const a = sampleTex(mul(x, -1.0), y);
	const b = sampleTex(0.0, y);
	const c = sampleTex(x, y);

	const d = sampleTex(mul(x, -1.0), 0.0);
	const e = sampleTex(0.0, 0.0);
	const f = sampleTex(x, 0.0);

	const g = sampleTex(mul(x, -1.0), mul(y, -1.0));
	const h = sampleTex(0.0, mul(y, -1.0));
	const i = sampleTex(x, mul(y, -1.0));

	let sum = e.mul(4.0);
	sum = sum.add(b.add(d).add(f).add(h).mul(2.0));
	sum = sum.add(a.add(c).add(g).add(i));
	sum = sum.mul(1.0 / 16.0);

	return vec4(sum, 1.0);
});

/**
 * A bloom effect.
 *
 * Based on an article by Lena Piquet:
 * https://www.froyok.fr/blog/2021-12-ue4-custom-bloom/
 */
export class UnrealBloomNode extends TempNode {
	inputNode: TSLAny;
	intensity: TSLAny;
	radius: TSLAny;
	threshold: TSLAny;
	smoothWidth: TSLAny;
	levels: number;

	private _resolutionScale: number;
	private _renderTargetBright: RenderTarget;
	private _renderTargetsDown: RenderTarget[];
	private _renderTargetsUp: RenderTarget[];

	private _highPassFilterMaterial: NodeMaterial | null = null;
	private _downsampleMaterials: NodeMaterial[] = [];
	private _upsampleMaterials: NodeMaterial[] = [];

	private _textureOutput: TSLAny;

	/**
	 * Constructs a new bloom effect.
	 *
	 * @param node - The input node.
	 * @param [options] - The options.
	 * @param [options.intensity=1.0] - The bloom intensity.
	 * @param [options.radius=0.85] - The blur radius. Only applies to mipmap blur.
	 * @param [options.luminanceThreshold=0.9] - The luminance threshold. Raise this value to mask out darker elements in the scene.
	 * @param [options.luminanceSmoothing=0.025] - Controls the smoothness of the luminance threshold.
	 * @param [options.levels=8] - The amount of MIP levels. Only applies to mipmap blur.
	 * @param [options.mipmapBlur=true] - Enables or disables mipmap blur.
	 * @param [options.resolutionScale=0.5] - Deprecated. Use mipmapBlur instead.
	 * @param [options.resolutionX] - Deprecated. Use mipmapBlur instead.
	 * @param [options.resolutionY] - Deprecated. Use mipmapBlur instead.
	 * @param [options.width] - Deprecated. Use mipmapBlur instead.
	 * @param [options.height] - Deprecated. Use mipmapBlur instead.
	 * @param [options.kernelSize] - Deprecated. Use mipmapBlur instead.
	 */
	constructor(
		node: TSLAny,
		{
			intensity = 1.0,
			radius = 0.85,
			luminanceThreshold = 0.9,
			luminanceSmoothing = 0.025,
			levels = 8,
			mipmapBlur = true,
			resolutionScale = 0.5,
			resolutionX,
			resolutionY,
			width,
			height,
			kernelSize,
		}: {
			intensity?: number;
			radius?: number;
			luminanceThreshold?: number;
			luminanceSmoothing?: number;
			levels?: number;
			mipmapBlur?: boolean;
			resolutionScale?: number;
			resolutionX?: number;
			resolutionY?: number;
			width?: number;
			height?: number;
			kernelSize?: number;
		} = {},
	) {
		super("vec4");

		if (!mipmapBlur) {
			console.warn("UnrealBloomNode: mipmapBlur=false is not supported. This node always uses mipmap blur.");
		}

		if (kernelSize !== undefined) {
			console.warn("UnrealBloomNode: kernelSize is deprecated and ignored. Use radius instead.");
		}

		if (resolutionX !== undefined || resolutionY !== undefined || width !== undefined || height !== undefined) {
			console.warn("UnrealBloomNode: resolutionX/Y and width/height are deprecated and ignored.");
		}

		this.inputNode = nodeObject(node);
		this.intensity = uniform(intensity);
		this.radius = uniform(radius);
		this.threshold = uniform(luminanceThreshold);
		this.smoothWidth = uniform(luminanceSmoothing);
		this.levels = Math.max(1, levels);
		this._resolutionScale = resolutionScale;

		this._renderTargetBright = new RenderTarget(1, 1, { depthBuffer: false, type: HalfFloatType });
		this._renderTargetBright.texture.name = "MipmapBloom.bright";
		this._renderTargetBright.texture.generateMipmaps = false;

		this._renderTargetsDown = [];
		this._renderTargetsUp = [];

		for (let i = 0; i < this.levels; i++) {
			const rtDown = new RenderTarget(1, 1, { depthBuffer: false, type: HalfFloatType });
			rtDown.texture.name = `MipmapBloom.down${i}`;
			rtDown.texture.generateMipmaps = false;
			this._renderTargetsDown.push(rtDown);

			const rtUp = new RenderTarget(1, 1, { depthBuffer: false, type: HalfFloatType });
			rtUp.texture.name = `MipmapBloom.up${i}`;
			rtUp.texture.generateMipmaps = false;
			this._renderTargetsUp.push(rtUp);
		}

		this._textureOutput = passTexture(this as TSLAny, (this._renderTargetsUp[0] as RenderTarget).texture);
		this.updateBeforeType = NodeUpdateType.FRAME;
	}

	getTextureNode() {
		return this._textureOutput;
	}

	setResolutionScale(resolutionScale: number) {
		this._resolutionScale = resolutionScale;
		return this;
	}

	getResolutionScale() {
		return this._resolutionScale;
	}

	setSize(width: number, height: number) {
		let resx = Math.floor(width * this._resolutionScale);
		let resy = Math.floor(height * this._resolutionScale);

		this._renderTargetBright.setSize(resx, resy);

		for (let i = 0; i < this.levels; i++) {
			resx = Math.max(1, Math.floor(resx / 2));
			resy = Math.max(1, Math.floor(resy / 2));

			(this._renderTargetsDown[i] as RenderTarget).setSize(resx, resy);
			(this._renderTargetsUp[i] as RenderTarget).setSize(resx, resy);

			if (this._downsampleMaterials[i]) {
				(this._downsampleMaterials[i] as NodeMaterial as TSLAny).invSize.value.set(1.0 / resx, 1.0 / resy);
			}
			if (this._upsampleMaterials[i]) {
				(this._upsampleMaterials[i] as NodeMaterial as TSLAny).invSize.value.set(1.0 / resx, 1.0 / resy);
			}
		}
	}

	updateBefore(frame: NodeFrame): boolean | undefined {
		const renderer = frame.renderer as TSLAny;
		if (!renderer) return;

		_rendererState = RendererUtils.resetRendererState(renderer, _rendererState);

		const size = renderer.getDrawingBufferSize(_size);
		this.setSize(size.width, size.height);

		// 1. Extract bright areas
		renderer.setRenderTarget(this._renderTargetBright);
		_quadMesh.material = this._highPassFilterMaterial as NodeMaterial;
		_quadMesh.name = "MipmapBloom [ High Pass ]";
		_quadMesh.render(renderer);

		// 2. Downsample
		let inputRenderTarget = this._renderTargetBright;
		for (let i = 0; i < this.levels; i++) {
			_quadMesh.material = this._downsampleMaterials[i] as NodeMaterial;
			(this._downsampleMaterials[i] as NodeMaterial as TSLAny).srcTexture.value = inputRenderTarget.texture;

			renderer.setRenderTarget(this._renderTargetsDown[i] as RenderTarget);
			_quadMesh.name = `MipmapBloom [ Downsample ${i} ]`;
			_quadMesh.render(renderer);

			inputRenderTarget = this._renderTargetsDown[i] as RenderTarget;
		}

		// 3. Upsample & blend
		// First upsample reads from the last downsample
		let upsampleInput = this._renderTargetsDown[this.levels - 1] as RenderTarget;

		for (let i = this.levels - 2; i >= 0; i--) {
			_quadMesh.material = this._upsampleMaterials[i] as NodeMaterial;
			(this._upsampleMaterials[i] as NodeMaterial as TSLAny).srcTexture.value = upsampleInput.texture;

			renderer.setRenderTarget(this._renderTargetsUp[i] as RenderTarget);
			_quadMesh.name = `MipmapBloom [ Upsample ${i} ]`;

			(this._upsampleMaterials[i] as NodeMaterial as TSLAny).downTexture.value = (
				this._renderTargetsDown[i] as RenderTarget
			).texture;

			_quadMesh.render(renderer);

			upsampleInput = this._renderTargetsUp[i] as RenderTarget;
		}

		RendererUtils.restoreRendererState(renderer, _rendererState);

		return undefined;
	}

	setup(builder: NodeBuilder) {
		// High pass
		this._highPassFilterMaterial = this._highPassFilterMaterial || new NodeMaterial();
		this._highPassFilterMaterial.fragmentNode = (
			luminosityHighPass({
				input: this.inputNode,
				threshold: this.threshold,
				smoothWidth: this.smoothWidth,
			}) as TSLAny
		).context((builder as TSLAny).getSharedContext());
		this._highPassFilterMaterial.name = "MipmapBloom_highPass";
		this._highPassFilterMaterial.needsUpdate = true;

		// Downsample
		for (let i = 0; i < this.levels; i++) {
			if (!this._downsampleMaterials[i]) {
				const srcTexture = texture(null as TSLAny);
				const invSize = uniform(new Vector2());

				const mat = new NodeMaterial();
				mat.fragmentNode = (downsamplePass({ src: srcTexture, invSize }) as TSLAny).context(
					(builder as TSLAny).getSharedContext(),
				);
				mat.name = `MipmapBloom_downsample_${i}`;
				mat.needsUpdate = true;

				(mat as TSLAny).srcTexture = srcTexture;
				(mat as TSLAny).invSize = invSize;
				this._downsampleMaterials.push(mat);
			}
		}

		// Upsample
		for (let i = 0; i < this.levels - 1; i++) {
			if (!this._upsampleMaterials[i]) {
				const srcTexture = texture(null as TSLAny);
				const downTexture = texture(null as TSLAny); // The downsampled mip to add to
				const invSize = uniform(new Vector2());

				const mat = new NodeMaterial();

				const upsampleAndAdd = Fn(() => {
					// sample upsample
					const up = upsamplePass({ src: srcTexture, invSize, radius: this.radius });
					// sample corresponding down mip
					const down = texture(downTexture, uv());
					return vec4((up as TSLAny).rgb.add((down as TSLAny).rgb), 1.0);
				});

				mat.fragmentNode = (upsampleAndAdd() as TSLAny).context((builder as TSLAny).getSharedContext());
				mat.name = `MipmapBloom_upsample_${i}`;
				mat.needsUpdate = true;

				(mat as TSLAny).srcTexture = srcTexture;
				(mat as TSLAny).downTexture = downTexture;
				(mat as TSLAny).invSize = invSize;
				this._upsampleMaterials.push(mat);
			}
		}

		return vec4(this._textureOutput.rgb.mul(this.intensity), 1.0);
	}

	dispose() {
		this._renderTargetBright.dispose();
		for (const rt of this._renderTargetsDown) rt.dispose();
		for (const rt of this._renderTargetsUp) rt.dispose();

		if (this._highPassFilterMaterial) this._highPassFilterMaterial.dispose();

		for (const mat of this._downsampleMaterials) mat.dispose();
		for (const mat of this._upsampleMaterials) mat.dispose();
	}
}
