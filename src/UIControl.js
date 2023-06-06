import { GUI } from 'lil-gui';
import defaultOptions from './configs/options.json';
import { cloneJson, exportFileJSON, importFileJSON, upgradeJson } from './Utils.js';

export class UIControl {

	constructor(viewer) {
		const gui = new GUI({ closeFolders: true });

		const options = cloneJson(defaultOptions);

		// Global

		const globalFolder = gui.addFolder('Global').onChange(() => {
			viewer.setGlobal(options.global);
		});
		globalFolder.add(options.global, 'wireframe');

		// Ground

		const groundFolder = gui.addFolder('Ground').onChange(() => {
			viewer.setGround(options.ground);
		});
		groundFolder.add(options.ground, 'show');
		groundFolder.addColor(options.ground, 'color');
		groundFolder.add(options.ground, 'grid');

		// Environment

		const environmentFolder = gui.addFolder('Environment').onChange(e => {
			if (e.property === 'texture') {
				viewer.setEnvironmentTexture(options.environment.texture);
			} else {
				viewer.setEnvironmentParams(options.environment);
			}
		});
		environmentFolder.add(options.environment, 'texture', ['Pisa', 'Factory_Catwalk', 'Barce_Rooftop_C', 'Grand_Canyon_C', 'Hall', 'Ice_Lake', 'Old_Industrial_Hall']);
		environmentFolder.add(options.environment, 'diffuseIntensity', 0, 1, 0.001);
		environmentFolder.add(options.environment, 'skyRoughness', 0, 8, 0.1);

		// Camera

		const cameraFolder = gui.addFolder('Camera').onChange(() => {
			viewer.setCamera(options.camera);
		});
		cameraFolder.add(options.camera, 'fov', 10, 180, 1);
		cameraFolder.add(options.camera, 'type', ['perspective', 'othographic']);
		cameraFolder.add(options.camera, 'outputEncoding', ['Linear', 'Gamma']);

		// Light

		const lightFolder = gui.addFolder('Lights');

		const ambientFolder = lightFolder.addFolder('Ambient Light').onChange(() => viewer.setAmbientLight(options.light.ambient));
		ambientFolder.add(options.light.ambient, 'intensity', 0, 1, 0.001);
		ambientFolder.addColor(options.light.ambient, 'color');

		const directional1Folder = lightFolder.addFolder('Directional Light 1').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional1, 1);
			viewer.setShadow(options.light.directional.directional1, 1);
		});
		directional1Folder.add(options.light.directional.directional1, 'intensity', 0, 1, 0.001);
		directional1Folder.addColor(options.light.directional.directional1, 'color');
		const rotation1Folder = directional1Folder.addFolder('direction');
		rotation1Folder.add(options.light.directional.directional1.direction, 'x', 0, 360, 0.01).name('horizontal');
		rotation1Folder.add(options.light.directional.directional1.direction, 'y', 0, 90, 0.01).name('verticle');
		directional1Folder.add(options.light.directional.directional1, 'lensflare');
		directional1Folder.add(options.light.directional.directional1, 'shadowenable');
		directional1Folder.add(options.light.directional.directional1, 'shadowbias', -0.1, 0.1, 0.0001);
		directional1Folder.add(options.light.directional.directional1, 'shadowquality', ['Low', 'Medium', 'High', 'Ultra']);

		const directional2Folder = lightFolder.addFolder('Directional Light 2').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.directional2, 2);
			viewer.setShadow(options.light.directional.directional2, 2)
		});
		directional2Folder.add(options.light.directional.directional2, 'intensity', 0, 1, 0.001);
		directional2Folder.addColor(options.light.directional.directional2, 'color');
		const rotation2Folder = directional2Folder.addFolder('direction');
		rotation2Folder.add(options.light.directional.directional2.direction, 'x', 0, 360, 0.01).name('horizontal');
		rotation2Folder.add(options.light.directional.directional2.direction, 'y', 0, 90, 0.01).name('verticle');
		directional2Folder.add(options.light.directional.directional2, 'lensflare');
		directional2Folder.add(options.light.directional.directional2, 'shadowenable');
		directional2Folder.add(options.light.directional.directional2, 'shadowbias', -0.1, 0.1, 0.0001);
		directional2Folder.add(options.light.directional.directional2, 'shadowquality', ['Low', 'Medium', 'High', 'Ultra']);

		const cameraDirectional = lightFolder.addFolder('Camera Directional Light').onChange(() => {
			viewer.setDirectionalLight(options.light.directional.cameraDirectional, 0)
		});
		cameraDirectional.add(options.light.directional.cameraDirectional, 'intensity', 0, 1, 0.001);
		cameraDirectional.addColor(options.light.directional.cameraDirectional, 'color');

		// Post Effect

		const effectFolder = gui.addFolder('Post Effect').onChange(() => {
			viewer.setPostEffect(options.postEffect);
		});

		effectFolder.add(options.postEffect, 'MSAA');

		const colorCorrectionEffectFolder = effectFolder.addFolder('Color Correction');
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'active');
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'brightness', 0, 0.5, 0.01);
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'contrast', 1, 1.5, 0.01);
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'exposure', 0, 1, 0.1);
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'gamma', 0, 2, 0.1);
		colorCorrectionEffectFolder.add(options.postEffect.colorCorrection, 'saturation', -1, 5, 0.001);

		const bloomEffectFolder = effectFolder.addFolder('Bloom');
		bloomEffectFolder.add(options.postEffect.bloom, 'active');
		bloomEffectFolder.add(options.postEffect.bloom, 'strength', 0, 2, 0.01);
		bloomEffectFolder.add(options.postEffect.bloom, 'threshold', 0, 1, 0.01);
		bloomEffectFolder.add(options.postEffect.bloom, 'blurSize', 0, 5, 0.01);
		bloomEffectFolder.add(options.postEffect.bloom, 'smoothWidth', 0, 1, 0.01);

		const ssaoEffectFolder = effectFolder.addFolder('SSAO');
		ssaoEffectFolder.add(options.postEffect.ssao, 'active');
		ssaoEffectFolder.add(options.postEffect.ssao, 'radius', 0, 50, 0.01);
		ssaoEffectFolder.add(options.postEffect.ssao, 'power', 0, 5, 0.1);
		ssaoEffectFolder.add(options.postEffect.ssao, 'bias', 0, 1, 0.0001);
		ssaoEffectFolder.add(options.postEffect.ssao, 'intensity', 0, 2, 0.01);
		ssaoEffectFolder.add(options.postEffect.ssao, 'quality', ['Low', 'Medium', 'High', 'Ultra']);
		ssaoEffectFolder.add(options.postEffect.ssao, 'autoSampleWeight');

		const ssrEffectFolder = effectFolder.addFolder('SSR');
		ssrEffectFolder.add(options.postEffect.ssr, 'active');
		ssrEffectFolder.add(options.postEffect.ssr, 'pixelStride', 1, 100, 1);
		ssrEffectFolder.add(options.postEffect.ssr, 'maxIteration', 1, 20, 1);
		ssrEffectFolder.add(options.postEffect.ssr, 'maxSteps', 1, 500, 1);
		ssrEffectFolder.add(options.postEffect.ssr, 'maxRayDistance', 1, 2000, 0.01);
		ssrEffectFolder.add(options.postEffect.ssr, 'enablePixelStrideZCutoff');
		ssrEffectFolder.add(options.postEffect.ssr, 'pixelStrideZCutoff', 1, 300, 0.01);
		ssrEffectFolder.add(options.postEffect.ssr, 'minGlossiness', 0, 1, 0.01);
		ssrEffectFolder.add(options.postEffect.ssr, 'strength', 0, 1.5, 0.01);
		ssrEffectFolder.add(options.postEffect.ssr, 'mixType', [0, 1]);

		const dofEffectFolder = effectFolder.addFolder('DOF');
		dofEffectFolder.add(options.postEffect.dof, 'active');
		dofEffectFolder.add(options.postEffect.dof, 'focalDepth', 0, 100, 0.1);
		dofEffectFolder.add(options.postEffect.dof, 'focalLength', 0, 100, 0.1);
		dofEffectFolder.add(options.postEffect.dof, 'fstop', 0, 1, 0.1);
		dofEffectFolder.add(options.postEffect.dof, 'maxblur', 0, 1, 0.1);
		dofEffectFolder.add(options.postEffect.dof, 'threshold', 0, 1, 0.1);
		dofEffectFolder.add(options.postEffect.dof, 'gain', 0, 2, 0.1);
		dofEffectFolder.add(options.postEffect.dof, 'bias', 0, 1, 0.001);
		dofEffectFolder.add(options.postEffect.dof, 'dithering', 0, 0.001, 0.00001);

		const fxaaEffectFolder = effectFolder.addFolder('FXAA');
		fxaaEffectFolder.add(options.postEffect.fxaa, 'active');

		const chromaticAberrationEffectFolder = effectFolder.addFolder('ChromaticAberration');
		chromaticAberrationEffectFolder.add(options.postEffect.chromaticaberration, 'active');
		chromaticAberrationEffectFolder.add(options.postEffect.chromaticaberration, 'chromaFactor', 0, 1, 0.0001);

		const vignettingEffectFolder = effectFolder.addFolder('Vignetting');
		vignettingEffectFolder.add(options.postEffect.vignetting, 'active');
		vignettingEffectFolder.addColor(options.postEffect.vignetting, 'color');
		vignettingEffectFolder.add(options.postEffect.vignetting, 'offset', 0, 5, 0.1);

		const blurEdgeEffectFolder = effectFolder.addFolder('BlurEdge');
		blurEdgeEffectFolder.add(options.postEffect.bluredge, 'active');
		blurEdgeEffectFolder.add(options.postEffect.bluredge, 'offset', 0, 5, 0.1);

		const filmEffectFolder = effectFolder.addFolder('Film');
		filmEffectFolder.add(options.postEffect.film, 'active');
		filmEffectFolder.add(options.postEffect.film, 'noiseIntensity', 0, 1, 0.01);
		filmEffectFolder.add(options.postEffect.film, 'scanlinesIntensity', 0, 1, 0.01);
		filmEffectFolder.add(options.postEffect.film, 'scanlinesCount', 0, 3000, 100);
		filmEffectFolder.add(options.postEffect.film, 'grayscale');

		const glowEffectFolder = effectFolder.addFolder('Glow');
		glowEffectFolder.add(options.postEffect.glow, 'active');
		glowEffectFolder.add(options.postEffect.glow, 'strength', 0, 2, 0.01);
		glowEffectFolder.add(options.postEffect.glow, 'radius', 0, 5, 0.01);
		glowEffectFolder.add(options.postEffect.glow, 'threshold', 0, 1, 0.01);
		glowEffectFolder.add(options.postEffect.glow, 'smoothWidth', 0, 1, 0.01);

		const lensflareEffectFolder = effectFolder.addFolder('Lensflare');
		lensflareEffectFolder.add(options.postEffect.lensflare, 'active');

		// Debugger

		const debuggerFolder = gui.addFolder('Debugger').onChange(() => {
			viewer.setDebugger(options.debuggers);
		});
		debuggerFolder.add(options.debuggers, 'type', ['None', 'Normal', 'Depth', 'Position', 'SSAO', 'SSR', 'UV', 'Lensflare']);

		// Animation

		const animationControls = {
			playAll: () => { viewer.playAllClips() },
			stopAll: () => { viewer.stopAllClips() }
		};

		const animationFolder = gui.addFolder('Animation');
		animationFolder.add(animationControls, 'playAll');
		animationFolder.add(animationControls, 'stopAll');
		animationFolder.add(options.animation, 'timeScale', -2, 2, 0.1).onChange(value => viewer.timeScale = value);
		animationFolder.hide();

		// Save & Load

		const fileControls = {
			import: () => {
				importFileJSON(_options => {
					viewer.updateCameraView(_options.cameraView);
					this.updateOptions(upgradeJson(_options));
				});
			},
			export: () => {
				viewer.exportCameraView(options);
				exportFileJSON(options);
			}
		}

		const fileFolder = gui.addFolder('File');
		fileFolder.add(fileControls, 'import');
		fileFolder.add(fileControls, 'export');

		//

		const animCtrls = [];
		this.setAnimations = function(animations) {
			if (animCtrls.length > 0) {
				animCtrls.forEach(ctrl => ctrl.destroy());
				animCtrls.length = 0;
			}

			if (animations && animations.length > 0) {
				animationFolder.show();

				const actionStates = viewer.actionStates = {};
				animations.forEach((clip, clipIndex) => {
					// Autoplay the first clip.
					if (clipIndex === 0) {
						actionStates[clip.name] = true;
					} else {
						actionStates[clip.name] = false;
					}

					// Play other clips when enabled.
					const ctrl = animationFolder.add(actionStates, clip.name).listen();
					ctrl.onChange(playAnimation => {
						playAnimation ? viewer.actions[clipIndex].weight = 1 : viewer.actions[clipIndex].weight = 0;
					});
					animCtrls.push(ctrl);
				});
			} else {
				animationFolder.hide();
			}
		}

		this.updateOptions = function(options) {
			gui.children[0].children[0].setValue(options.global.wireframe);

			gui.children[1].children[0].setValue(options.ground.show);
			gui.children[1].children[1].setValue(options.ground.color);
			gui.children[1].children[2].setValue(options.ground.grid);

			gui.children[2].children[0].setValue(options.environment.texture);
			gui.children[2].children[1].setValue(options.environment.diffuseIntensity);
			gui.children[2].children[2].setValue(options.environment.skyRoughness);

			gui.children[3].children[0].setValue(options.camera.fov);
			gui.children[3].children[1].setValue(options.camera.type);
			gui.children[3].children[2].setValue(options.camera.outputEncoding);

			gui.children[4].children[0].children[0].setValue(options.light.ambient.intensity);
			gui.children[4].children[0].children[1].setValue(options.light.ambient.color);

			gui.children[4].children[1].children[0].setValue(options.light.directional.directional1.intensity);
			gui.children[4].children[1].children[1].setValue(options.light.directional.directional1.color);
			gui.children[4].children[1].children[2].children[0].setValue(options.light.directional.directional1.direction.x);
			gui.children[4].children[1].children[2].children[1].setValue(options.light.directional.directional1.direction.y);
			gui.children[4].children[1].children[3].setValue(options.light.directional.directional1.lensflare);
			gui.children[4].children[1].children[4].setValue(options.light.directional.directional1.shadowenable);
			gui.children[4].children[1].children[5].setValue(options.light.directional.directional1.shadowbias);
			gui.children[4].children[1].children[6].setValue(options.light.directional.directional1.shadowquality);

			gui.children[4].children[2].children[0].setValue(options.light.directional.directional2.intensity);
			gui.children[4].children[2].children[1].setValue(options.light.directional.directional2.color);
			gui.children[4].children[2].children[2].children[0].setValue(options.light.directional.directional2.direction.x);
			gui.children[4].children[2].children[2].children[1].setValue(options.light.directional.directional2.direction.y);
			gui.children[4].children[2].children[3].setValue(options.light.directional.directional2.lensflare);
			gui.children[4].children[2].children[4].setValue(options.light.directional.directional2.shadowenable);
			gui.children[4].children[2].children[5].setValue(options.light.directional.directional2.shadowbias);
			gui.children[4].children[2].children[6].setValue(options.light.directional.directional2.shadowquality);

			gui.children[4].children[3].children[0].setValue(options.light.directional.cameraDirectional.intensity);
			gui.children[4].children[3].children[1].setValue(options.light.directional.cameraDirectional.color);

			gui.children[5].children[0].setValue(options.postEffect.MSAA);

			gui.children[5].children[1].children[0].setValue(options.postEffect.colorCorrection.active);
			gui.children[5].children[1].children[1].setValue(options.postEffect.colorCorrection.brightness);
			gui.children[5].children[1].children[2].setValue(options.postEffect.colorCorrection.contrast);
			gui.children[5].children[1].children[3].setValue(options.postEffect.colorCorrection.exposure);
			gui.children[5].children[1].children[4].setValue(options.postEffect.colorCorrection.gamma);
			gui.children[5].children[1].children[5].setValue(options.postEffect.colorCorrection.saturation);

			gui.children[5].children[2].children[0].setValue(options.postEffect.bloom.active);
			gui.children[5].children[2].children[1].setValue(options.postEffect.bloom.strength);
			gui.children[5].children[2].children[2].setValue(options.postEffect.bloom.threshold);
			gui.children[5].children[2].children[3].setValue(options.postEffect.bloom.blurSize);
			gui.children[5].children[2].children[4].setValue(options.postEffect.bloom.smoothWidth);

			gui.children[5].children[3].children[0].setValue(options.postEffect.ssao.active);
			gui.children[5].children[3].children[1].setValue(options.postEffect.ssao.radius);
			gui.children[5].children[3].children[2].setValue(options.postEffect.ssao.power);
			gui.children[5].children[3].children[3].setValue(options.postEffect.ssao.bias);
			gui.children[5].children[3].children[4].setValue(options.postEffect.ssao.intensity);
			gui.children[5].children[3].children[5].setValue(options.postEffect.ssao.quality);
			gui.children[5].children[3].children[6].setValue(options.postEffect.ssao.autoSampleWeight);

			gui.children[5].children[4].children[0].setValue(options.postEffect.ssr.active);
			gui.children[5].children[4].children[1].setValue(options.postEffect.ssr.pixelStride);
			gui.children[5].children[4].children[2].setValue(options.postEffect.ssr.maxIteration);
			gui.children[5].children[4].children[3].setValue(options.postEffect.ssr.maxSteps);
			gui.children[5].children[4].children[4].setValue(options.postEffect.ssr.maxRayDistance);
			gui.children[5].children[4].children[5].setValue(options.postEffect.ssr.enablePixelStrideZCutoff);
			gui.children[5].children[4].children[6].setValue(options.postEffect.ssr.pixelStrideZCutoff);
			gui.children[5].children[4].children[7].setValue(options.postEffect.ssr.minGlossiness);
			gui.children[5].children[4].children[8].setValue(options.postEffect.ssr.strength);
			gui.children[5].children[4].children[9].setValue(options.postEffect.ssr.mixType);

			gui.children[5].children[5].children[0].setValue(options.postEffect.dof.active);
			gui.children[5].children[5].children[1].setValue(options.postEffect.dof.focalDepth);
			gui.children[5].children[5].children[2].setValue(options.postEffect.dof.focalLength);
			gui.children[5].children[5].children[3].setValue(options.postEffect.dof.fstop);
			gui.children[5].children[5].children[4].setValue(options.postEffect.dof.maxblur);
			gui.children[5].children[5].children[5].setValue(options.postEffect.dof.threshold);
			gui.children[5].children[5].children[6].setValue(options.postEffect.dof.gain);
			gui.children[5].children[5].children[7].setValue(options.postEffect.dof.bias);
			gui.children[5].children[5].children[8].setValue(options.postEffect.dof.dithering);

			gui.children[5].children[6].children[0].setValue(options.postEffect.fxaa.active);

			gui.children[5].children[7].children[0].setValue(options.postEffect.chromaticaberration.active);
			gui.children[5].children[7].children[1].setValue(options.postEffect.chromaticaberration.chromaFactor);

			gui.children[5].children[8].children[0].setValue(options.postEffect.vignetting.active);
			gui.children[5].children[8].children[1].setValue(options.postEffect.vignetting.color);
			gui.children[5].children[8].children[2].setValue(options.postEffect.vignetting.offset);

			gui.children[5].children[9].children[0].setValue(options.postEffect.bluredge.active);
			gui.children[5].children[9].children[1].setValue(options.postEffect.bluredge.offset);

			gui.children[5].children[10].children[0].setValue(options.postEffect.film.active);
			gui.children[5].children[10].children[1].setValue(options.postEffect.film.noiseIntensity);
			gui.children[5].children[10].children[2].setValue(options.postEffect.film.scanlinesIntensity);
			gui.children[5].children[10].children[3].setValue(options.postEffect.film.scanlinesCount);
			gui.children[5].children[10].children[4].setValue(options.postEffect.film.grayscale);

			gui.children[5].children[11].children[0].setValue(options.postEffect.glow.active);
			gui.children[5].children[11].children[1].setValue(options.postEffect.glow.strength);
			gui.children[5].children[11].children[2].setValue(options.postEffect.glow.radius);
			gui.children[5].children[11].children[3].setValue(options.postEffect.glow.threshold);
			gui.children[5].children[11].children[4].setValue(options.postEffect.glow.smoothWidth);

			gui.children[5].children[12].children[0].setValue(options.postEffect.lensflare.active);

			gui.children[6].children[0].setValue(options.debuggers.type);

			gui.children[7].children[2].setValue(options.animation.timeScale);
		}
	}

}