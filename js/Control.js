import { GUI } from 'lil-gui';

export class AddGUI {

	constructor(viewer, options, app) {
		this.gui = new GUI();

		// Global

		const globalFolder = this.gui.addFolder('Global');
		globalFolder.add(options.global, 'wireframe').onChange(() => {
			viewer.setGlobal(options.global)
		});
		globalFolder.close();

		// Ground

		const groundFolder = this.gui.addFolder('Ground');
		groundFolder.add(options.ground, 'show').onChange(() => {
			viewer.setGround(options.ground)
		});
		groundFolder.addColor(options.ground, 'color').onChange(() => {
			viewer.setGround(options.ground)
		});
		groundFolder.add(options.ground, 'grid').onChange(() => {
			viewer.setGround(options.ground)
		})
		groundFolder.close();

		// Environment

		const environmentFolder = this.gui.addFolder('Environment');
		environmentFolder.add(options.environment, 'texture', ['Pisa', 'Factory_Catwalk', 'Barce_Rooftop_C', 'Grand_Canyon_C', 'Hall', 'Ice_Lake', 'Old_Industrial_Hall']).onChange(() => {
			viewer.setEnvironmentTexture(options.environment.texture)
		});
		environmentFolder.add(options.environment, 'diffuseIntensity', 0, 1, 0.001).onChange(() => {
			viewer.setEnvironmentParams(options.environment)
		});
		environmentFolder.add(options.environment, 'skyRoughness', 0, 8, 0.1).onChange(() => {
			viewer.setEnvironmentParams(options.environment)
		});
		environmentFolder.close();

		// Camera

		const cameraFolder = this.gui.addFolder('Camera');
		cameraFolder.add(options.camera, 'fov', 10, 180, 1).onChange(() => viewer.setCamera(options.camera));
		cameraFolder.add(options.camera, 'type', ['perspective', 'othographic']).onChange(() => viewer.setCamera(options.camera));
		cameraFolder.add(options.camera, 'outputEncoding', ['Linear', 'Gamma']).onChange(() => viewer.setCamera(options.camera));
		cameraFolder.close();

		// Light

		const lightFolder = this.gui.addFolder('Lights');
		const ambientFolder = lightFolder.addFolder('Ambient Light');
		ambientFolder.add(options.light.ambient, 'intensity', 0, 1, 0.001).onChange(() => {
			viewer.setAmbientLight(options.light.ambient)
		});
		ambientFolder.addColor(options.light.ambient, 'color').onChange(() => {
			viewer.setAmbientLight(options.light.ambient)
		});
		ambientFolder.close();
		const directional1Folder = lightFolder.addFolder('Directional Light 1');
		directional1Folder.add(options.light.directional.directional1, 'intensity', 0, 1, 0.001).onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional1, 1)
		});
		directional1Folder.addColor(options.light.directional.directional1, 'color').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional1, 1)
		});
		const rotation1Folder = directional1Folder.addFolder('direction');
		rotation1Folder.add(options.light.directional.directional1.direction, 'x', 0, 360, 0.01).name('horizontal').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional1, 1)
		});
		rotation1Folder.add(options.light.directional.directional1.direction, 'y', 0, 90, 0.01).name('verticle').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional1, 1)
		});
		rotation1Folder.close();
		directional1Folder.add(options.light.directional.directional1, 'lensflare').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional1, 1)
		});
		directional1Folder.add(options.light.directional.directional1, 'shadowenable').onChange(() => {
			viewer.setShadow(options.light.directional.directional1, 1)
		});
		directional1Folder.add(options.light.directional.directional1, 'shadowbias', -0.1, 0.1, 0.0001).onChange(() => {
			viewer.setShadow(options.light.directional.directional1, 1)
		});
		directional1Folder.add(options.light.directional.directional1, 'shadowquality', ['Low', 'Medium', 'High', 'Ultra']).onChange(() => {
			viewer.setShadow(options.light.directional.directional1, 1)
		})
		directional1Folder.close();
		const directional2Folder = lightFolder.addFolder('Directional Light 2');
		directional2Folder.add(options.light.directional.directional2, 'intensity', 0, 1, 0.001).onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional2, 2)
		});
		directional2Folder.addColor(options.light.directional.directional2, 'color').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional2, 2)
		});
		const rotation2Folder = directional2Folder.addFolder('direction');
		rotation2Folder.add(options.light.directional.directional2.direction, 'x', 0, 360, 0.01).name('horizontal').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional2, 2)
		});
		rotation2Folder.add(options.light.directional.directional2.direction, 'y', 0, 90, 0.01).name('verticle').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional2, 2)
		});
		rotation2Folder.close();
		directional2Folder.add(options.light.directional.directional2, 'lensflare').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional2, 2)
		});
		directional2Folder.add(options.light.directional.directional2, 'shadowenable').onChange(() => {
			viewer.setShadow(options.light.directional.directional2, 2)
		});
		directional2Folder.add(options.light.directional.directional2, 'shadowbias', -0.1, 0.1, 0.0001).onChange(() => {
			viewer.setShadow(options.light.directional.directional2, 2)
		});
		directional2Folder.add(options.light.directional.directional2, 'shadowquality', ['Low', 'Medium', 'High', 'Ultra']).onChange(() => {
			viewer.setShadow(options.light.directional.directional2, 2)
		})
		directional2Folder.close();
		const cameraDirectional = lightFolder.addFolder('Camera Directional Light');
		cameraDirectional.add(options.light.directional.cameraDirectional, 'intensity', 0, 1, 0.001).onChange(() => {
			viewer.setDirectionalLight(options.light.directional.cameraDirectional, 0)
		});
		cameraDirectional.addColor(options.light.directional.cameraDirectional, 'color').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.cameraDirectional, 0)
		});
		cameraDirectional.close();
		lightFolder.close();

		// Post Effect

		const effectFolder = this.gui.addFolder('Post Effect');
		effectFolder.add(options.postEffect, 'MSAA').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		const colorCorrectionEffectFolder = effectFolder.addFolder('Color Correction');
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'brightness', 0, 0.5, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'contrast', 1, 1.5, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'exposure', 0, 1, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'gamma', 0, 2, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'saturation', -1, 5, 0.001).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		colorCorrectionEffectFolder.close();
		const bloomEffectFolder = effectFolder.addFolder('Bloom');
		bloomEffectFolder.add(options.postEffect.bloom, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		bloomEffectFolder.add(options.postEffect.bloom, 'strength', 0, 2, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		bloomEffectFolder.add(options.postEffect.bloom, 'threshold', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		bloomEffectFolder.add(options.postEffect.bloom, 'blurSize', 0, 5, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		bloomEffectFolder.add(options.postEffect.bloom, 'smoothWidth', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		bloomEffectFolder.close();
		const ssaoEffectFolder = effectFolder.addFolder('SSAO');
		ssaoEffectFolder.add(options.postEffect.ssao, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssaoEffectFolder.add(options.postEffect.ssao, 'radius', 0, 5, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssaoEffectFolder.add(options.postEffect.ssao, 'power', 0, 5, 1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssaoEffectFolder.add(options.postEffect.ssao, 'bias', 0, 1, 0.0001).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssaoEffectFolder.add(options.postEffect.ssao, 'intensity', 0, 2, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssaoEffectFolder.add(options.postEffect.ssao, 'quality', ['Low', 'Medium', 'High', 'Ultra']).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssaoEffectFolder.close();
		const ssrEffectFolder = effectFolder.addFolder('SSR');
		ssrEffectFolder.add(options.postEffect.ssr, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.add(options.postEffect.ssr, 'maxRayDistance', 1, 1000, 1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.add(options.postEffect.ssr, 'pixelStride', 1, 100, 1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.add(options.postEffect.ssr, 'pixelStrideZCutoff', 1, 300, 1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.add(options.postEffect.ssr, 'screenEdgeFadeStart', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.add(options.postEffect.ssr, 'eyeFadeStart', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.add(options.postEffect.ssr, 'eyeFadeEnd', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.add(options.postEffect.ssr, 'minGlossiness', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		ssrEffectFolder.close();
		const dofEffectFolder = effectFolder.addFolder('DOF');
		dofEffectFolder.add(options.postEffect.dof, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'focalDepth', 0, 100, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'focalLength', 0, 100, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'fstop', 0, 1, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'maxblur', 0, 1, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'threshold', 0, 1, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'gain', 0, 2, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'bias', 0, 1, 0.001).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.add(options.postEffect.dof, 'dithering', 0, 0.001, 0.00001).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		dofEffectFolder.close();
		const fxaaEffectFolder = effectFolder.addFolder('FXAA');
		fxaaEffectFolder.add(options.postEffect.fxaa, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		fxaaEffectFolder.close();
		const chromaticAberrationEffectFolder = effectFolder.addFolder('ChromaticAberration');
		chromaticAberrationEffectFolder.add(options.postEffect.chromaticaberration, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		chromaticAberrationEffectFolder.add(options.postEffect.chromaticaberration, 'chromaFactor', 0, 1, 0.0001).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		chromaticAberrationEffectFolder.close();
		const vignettingEffectFolder = effectFolder.addFolder('Vignetting');
		vignettingEffectFolder.add(options.postEffect.vignetting, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		vignettingEffectFolder.addColor(options.postEffect.vignetting, 'color').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		vignettingEffectFolder.add(options.postEffect.vignetting, 'offset', 0, 5, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		vignettingEffectFolder.close();
		const blurEdgeEffectFolder = effectFolder.addFolder('BlurEdge');
		blurEdgeEffectFolder.add(options.postEffect.bluredge, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		blurEdgeEffectFolder.add(options.postEffect.bluredge, 'offset', 0, 5, 0.1).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		blurEdgeEffectFolder.close();
		const filmEffectFolder = effectFolder.addFolder('Film');
		filmEffectFolder.add(options.postEffect.film, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		filmEffectFolder.add(options.postEffect.film, 'noiseIntensity', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		filmEffectFolder.add(options.postEffect.film, 'scanlinesIntensity', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		filmEffectFolder.add(options.postEffect.film, 'scanlinesCount', 0, 3000, 100).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		filmEffectFolder.add(options.postEffect.film, 'grayscale').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		filmEffectFolder.close();
		const glowEffectFolder = effectFolder.addFolder('Glow');
		glowEffectFolder.add(options.postEffect.glow, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		glowEffectFolder.add(options.postEffect.glow, 'strength', 0, 2, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		glowEffectFolder.add(options.postEffect.glow, 'radius', 0, 5, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		glowEffectFolder.add(options.postEffect.glow, 'threshold', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		glowEffectFolder.add(options.postEffect.glow, 'smoothWidth', 0, 1, 0.01).onChange(() => {
			viewer.setPostEffect(options.postEffect)
		});
		glowEffectFolder.close();
		const lensflareEffectFolder = effectFolder.addFolder('Lensflare');
		lensflareEffectFolder.add(options.postEffect.lensflare, 'active').onChange(() => {
			viewer.setPostEffect(options.postEffect)
		})
		lensflareEffectFolder.close();
		effectFolder.close();

		// Debugger

		const debuggerFolder = this.gui.addFolder('Debugger');
		debuggerFolder.add(options.debuggers, 'type', ['None', 'Normal', 'Depth', 'Position', 'SSAO', 'SSR', 'UV', 'Lensflare']).onChange(() => viewer.setDebugger(options.debuggers));
		debuggerFolder.close();

		// Animation

		this.animationFolder = this.gui.addFolder('Animation');
		this.animationFolder.add(options.animation, 'playAll');
		this.animationFolder.add(options.animation, 'stopAll');
		this.animationFolder.add(options.animation, 'timeScale', -2, 2, 0.1).onChange(value => viewer.timeScale = value);
		this.animationFolder.close();
		this.animationFolder.domElement.style.display = 'none';
		this.animCtrls = [];

		this.setAnimationFolder = function(animations) {
			this.animCtrls.forEach(ctrl => ctrl.destroy());
			this.animCtrls.length = 0;
			if (animations.length) {
				this.animationFolder.domElement.style.display = '';
				const actionStates = viewer.actionStates = {};
				animations.forEach((clip, clipIndex) => {
					// Autoplay the first clip.
					if (clipIndex === 0) {
						actionStates[clip.name] = true;
					} else {
						actionStates[clip.name] = false;
					}

					// Play other clips when enabled.
					const ctrl = this.animationFolder.add(actionStates, clip.name).listen();
					ctrl.onChange(playAnimation => {
						playAnimation ? viewer.actions[clipIndex].weight = 1 : viewer.actions[clipIndex].weight = 0;
					});
					this.animCtrls.push(ctrl);
				});
			}
		}

		// FileTransfer

		const file = {
			import: function() { app.importFileJSON() },
			export: function() { app.exportFileJSON(options) }
		}
		const fileFolder = this.gui.addFolder('File');
		fileFolder.add(file, 'import');
		fileFolder.add(file, 'export');
		fileFolder.close();
	}

}