import { TEXEL_ENCODING_TYPE, Color3, ShaderMaterial, Geometry } from 't3d';
import { GeometryUtils } from 't3d/examples/jsm/geometries/GeometryUtils.js';
import { Texture2DLoader } from 't3d/examples/jsm/loaders/Texture2DLoader.js';
import { DefaultEffectComposer, GBufferDebugger, SSAODebugger, SSRDebugger, RenderListMask } from 't3d-effect-composer';
import { UVBuffer } from '../../node_modules/t3d-effect-composer/examples/jsm/uv/UVBuffer.js';
import { UVDebugger } from '../../node_modules/t3d-effect-composer/examples/jsm/uv/UVDebugger.js';
import { LensflareDebugger } from '../../node_modules/t3d-effect-composer/examples/jsm/lensflare/LensflareDebugger.js';
import { LensflareBuffer } from '../../node_modules/t3d-effect-composer/examples/jsm/lensflare/LensflareBuffer.js';
import { LensflareEffect } from '../../node_modules/t3d-effect-composer/examples/jsm/lensflare/LensflareEffect.js';

export class ViewerEffectComposer extends DefaultEffectComposer {

	constructor(width, height, renderer) {
		super(width, height, {
			samplerNumber: Math.min(renderer.renderPass.capabilities.maxSamples, 5),
			webgl2: true,
			floatColorBuffer: !!renderer.renderPass.capabilities.getExtension("EXT_color_buffer_float")
		});

		this.sceneMSAA = true;

		const uvCheckTexture = new Texture2DLoader().load('./textures/uv_checker.jpg');
		uvCheckTexture.anisotropy = 8;

		this.getBuffer('SceneBuffer').setOutputEncoding(TEXEL_ENCODING_TYPE.GAMMA);
		this.getBuffer('ColorMarkBuffer').setMaterialReplaceFunction(defaultMaterialReplaceFunction);
		this.addBuffer('UVBuffer', new UVBuffer(width, height, { uvCheckTexture }));
		this.addBuffer('LensflareBuffer', new LensflareBuffer(width, height));
		this._syncAttachments();

		this.getBuffer('ColorMarkBuffer').setGeometryReplaceFunction(geometryReplaceFunction);
		this.getBuffer('GBuffer').setGeometryReplaceFunction(geometryReplaceFunction);
		this.getBuffer('MarkBuffer').setGeometryReplaceFunction(geometryReplaceFunction);
		this.getBuffer('NonDepthMarkBuffer').setGeometryReplaceFunction(geometryReplaceFunction);
		this.getBuffer('SceneBuffer').setGeometryReplaceFunction(geometryReplaceFunction);

		this.getBuffer('SceneBuffer').renderLayers = [
			{ id: 2, mask: RenderListMask.ALL }, // background
			{ id: 0, mask: RenderListMask.ALL }
		];

		this.getEffect('Glow').bufferDependencies = [
			{ key: 'SceneBuffer' },
			{ key: 'ColorMarkBuffer', mask: RenderListMask.ALL }
		];

		this.addEffect('Lensflare', new LensflareEffect(), 101.5);
		this.getEffect('Lensflare').active = true;

		this._gBufferDebugger = new GBufferDebugger();
		this._ssaoDebugger = new SSAODebugger();
		this._ssrDebugger = new SSRDebugger();
		this._uvDebugger = new UVDebugger();
		this._lensflareDebugger = new LensflareDebugger();
	}

	setOptions(options) {
		this.sceneMSAA = options.MSAA;

		const colorCorrectionEffect = this.getEffect('ColorCorrection');
		for (const key in options.colorCorrection) {
			colorCorrectionEffect[key] = options.colorCorrection[key];
		}

		const bloomEffect = this.getEffect('Bloom');
		for (const key in options.bloom) {
			bloomEffect[key] = options.bloom[key];
		}

		const glowEffect = this.getEffect('Glow');
		for (const key in options.glow) {
			glowEffect[key] = options.glow[key];
		}

		const ssaoEffect = this.getEffect('SSAO');
		for (const key in options.ssao) {
			if (key !== 'options') {
				ssaoEffect[key] = options.ssao[key];
			}
		}

		const ssrEffect = this.getEffect('SSR');
		for (const key in options.ssr) {
			if (key !== 'options') {
				ssrEffect[key] = options.ssr[key];
			}
		}

		const dofEffect = this.getEffect('DOF');
		for (const key in options.dof) {
			if (key !== 'options') {
				dofEffect[key] = options.dof[key];
			}
		}

		const fxaaEffect = this.getEffect('FXAA');
		fxaaEffect.active = options.fxaa.active;

		const chromaticaberrationEffect = this.getEffect('ChromaticAberration');
		for (const key in options.chromaticaberration) {
			if (key !== 'options') {
				chromaticaberrationEffect[key] = options.chromaticaberration[key];
			}
		}

		const vignettingEffect = this.getEffect('Vignetting');
		vignettingEffect.active = options.vignetting.active;
		vignettingEffect.offset = options.vignetting.offset;
		vignettingEffect.color = new Color3(parseInt(options.vignetting.color.charAt(1) + options.vignetting.color.charAt(2), 16) / 255, parseInt(options.vignetting.color.charAt(3) + options.vignetting.color.charAt(4), 16) / 255, parseInt(options.vignetting.color.charAt(5) + options.vignetting.color.charAt(6), 16) / 255);

		const bluredgeEffect = this.getEffect('BlurEdge');
		for (const key in options.bluredge) {
			if (key !== 'options') {
				bluredgeEffect[key] = options.bluredge[key];
			}
		}

		const filmEffect = this.getEffect('Film');
		for (const key in options.film) {
			if (key !== 'options') {
				filmEffect[key] = options.film[key];
			}
		}

		const lensflareEffect = this.getEffect('Lensflare');
		lensflareEffect.active = options.lensflare.active;
	}

	setDebugger(options) {
		if (options.type === 'Normal') {
			this._gBufferDebugger.debugType = GBufferDebugger.DebugTypes.Normal;
			this.debugger = this._gBufferDebugger;
		} else if (options.type === 'Depth') {
			this._gBufferDebugger.debugType = GBufferDebugger.DebugTypes.Depth;
			this.debugger = this._gBufferDebugger;
		} else if (options.type === 'Position') {
			this._gBufferDebugger.debugType = GBufferDebugger.DebugTypes.Position;
			this.debugger = this._gBufferDebugger;
		} else if (options.type === 'SSAO') {
			this.debugger = this._ssaoDebugger;
		} else if (options.type === 'SSR') {
			this.debugger = this._ssrDebugger;
		} else if (options.type === 'UV') {
			this.debugger = this._uvDebugger;
		} else if (options.type === 'Lensflare') {
			this.debugger = this._lensflareDebugger;
		} else {
			this.debugger = null;
		}
	}

}

const materialMap = new Map();

function defaultMaterialReplaceFunction(renderable) {
	const useSkinning = renderable.object.isSkinnedMesh && renderable.object.skeleton;
	const morphTargets = !!renderable.object.morphTargetInfluences;
	const drawMode = renderable.material.drawMode;
	const useDiffuseMap = !!renderable.material.diffuseMap;

	const key = useSkinning + '_' + morphTargets + '_' + drawMode + '' + useDiffuseMap;

	let result;

	if (materialMap.has(key)) {
		result = materialMap.get(key);
	} else {
		result = new ShaderMaterial(colorShader);
		result.premultipliedAlpha = false; // multiply alpha in shader
		result.drawMode = drawMode;
		materialMap.set(key, result);
	}

	result.transparent = renderable.material.transparent;
	result.blending = renderable.material.blending;
	result.opacity = renderable.material.opacity;
	result.diffuse.copy(renderable.material.diffuse);
	result.diffuseMap = renderable.material.diffuseMap;
	result.emissive.copy(renderable.material.emissive);

	return result;
}

const colorShader = {
	name: 'ec_color',
	defines: {},
	uniforms: {
		strength: 1,
	},
	vertexShader: `
        #include <common_vert>
        #include <morphtarget_pars_vert>
        #include <skinning_pars_vert>
        #include <uv_pars_vert>
		#include <logdepthbuf_pars_vert>
        void main() {
        	#include <uv_vert>
        	#include <begin_vert>
        	#include <morphtarget_vert>
        	#include <skinning_vert>
        	#include <pvm_vert>
			#include <logdepthbuf_vert>
        }
    `,
	fragmentShader: `
        #include <common_frag>
        #include <diffuseMap_pars_frag>

        #include <uv_pars_frag>

		#include <logdepthbuf_pars_frag>

		uniform float strength;

		uniform vec3 emissive;

        void main() {
			#include <logdepthbuf_frag>

			vec4 outColor = vec4(u_Color, u_Opacity);

			#ifdef USE_DIFFUSE_MAP
				outColor *= texture2D(diffuseMap, v_Uv);
			#endif

			#ifdef ALPHATEST
				if(outColor.a < ALPHATEST) discard;
			#endif

			outColor.a *= strength;
			outColor.rgb *= outColor.a;

			outColor.rgb += emissive;

            gl_FragColor = outColor;
        }
    `
};

export function geometryReplaceFunction(renderable) {
	if (renderable.material.wireframe) {
		return getWireframeGeometry(renderable.geometry);
	} else {
		return renderable.geometry;
	}
}

const wireframeGeometries = new WeakMap();

function onGeometryDispose(event) {
	const geometry = event.target;

	geometry.removeEventListener('dispose', onGeometryDispose);

	if (wireframeGeometries.has(geometry)) {
		wireframeGeometries.get(geometry).dispose();
		wireframeGeometries.delete(geometry);
	}
}

function getWireframeGeometry(geometry) {
	if (wireframeGeometries.has(geometry)) {
		return wireframeGeometries.get(geometry);
	} else {
		const wireframeGeometry = new Geometry();
		wireframeGeometry.attributes = geometry.attributes;
		wireframeGeometry.morphAttributes = geometry.morphAttributes;
		wireframeGeometry.index = GeometryUtils.getWireframeAttribute(geometry);
		wireframeGeometry.boundingBox = geometry.boundingBox;
		wireframeGeometry.boundingSphere = geometry.boundingSphere;
		// wireframeGeometry.groups = geometry.groups;
		wireframeGeometry.instanceCount = geometry.instanceCount;

		wireframeGeometries.set(geometry, wireframeGeometry);

		geometry.addEventListener('dispose', onGeometryDispose);

		return wireframeGeometry;
	}
}