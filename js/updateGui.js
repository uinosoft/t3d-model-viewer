export function updateGui(controls, options) {
	controls.children[0].children[0].setValue(options.global.wireframe);

	controls.children[1].children[0].setValue(options.ground.show);
	controls.children[1].children[1].setValue(options.ground.color);
	controls.children[1].children[2].setValue(options.ground.grid);

	controls.children[2].children[0].setValue(options.environment.texture);
	controls.children[2].children[1].setValue(options.environment.diffuseIntensity);
	controls.children[2].children[2].setValue(options.environment.skyRoughness);

	controls.children[3].children[0].setValue(options.camera.fov);
	controls.children[3].children[1].setValue(options.camera.type);
	controls.children[3].children[2].setValue(options.camera.outputEncoding);

	controls.children[4].children[0].children[0].setValue(options.light.ambient.intensity);
	controls.children[4].children[0].children[1].setValue(options.light.ambient.color);

	controls.children[4].children[1].children[0].setValue(options.light.directional.directional1.intensity);
	controls.children[4].children[1].children[1].setValue(options.light.directional.directional1.color);
	controls.children[4].children[1].children[2].children[0].setValue(options.light.directional.directional1.direction.x);
	controls.children[4].children[1].children[2].children[1].setValue(options.light.directional.directional1.direction.y);
	controls.children[4].children[1].children[3].setValue(options.light.directional.directional1.lensflare);
	controls.children[4].children[1].children[4].setValue(options.light.directional.directional1.shadowenable);
	controls.children[4].children[1].children[5].setValue(options.light.directional.directional1.shadowbias);
	controls.children[4].children[1].children[6].setValue(options.light.directional.directional1.shadowquality);

	controls.children[4].children[2].children[0].setValue(options.light.directional.directional2.intensity);
	controls.children[4].children[2].children[1].setValue(options.light.directional.directional2.color);
	controls.children[4].children[2].children[2].children[0].setValue(options.light.directional.directional2.direction.x);
	controls.children[4].children[2].children[2].children[1].setValue(options.light.directional.directional2.direction.y);
	controls.children[4].children[2].children[3].setValue(options.light.directional.directional2.lensflare);
	controls.children[4].children[2].children[4].setValue(options.light.directional.directional2.shadowenable);
	controls.children[4].children[2].children[5].setValue(options.light.directional.directional2.shadowbias);
	controls.children[4].children[2].children[6].setValue(options.light.directional.directional2.shadowquality);

	controls.children[4].children[3].children[0].setValue(options.light.directional.cameraDirectional.intensity);
	controls.children[4].children[3].children[1].setValue(options.light.directional.cameraDirectional.color);

	controls.children[5].children[0].setValue(options.postEffect.MSAA);

	controls.children[5].children[1].children[0].setValue(options.postEffect.colorCorrection.active);
	controls.children[5].children[1].children[1].setValue(options.postEffect.colorCorrection.brightness);
	controls.children[5].children[1].children[2].setValue(options.postEffect.colorCorrection.contrast);
	controls.children[5].children[1].children[3].setValue(options.postEffect.colorCorrection.exposure);
	controls.children[5].children[1].children[4].setValue(options.postEffect.colorCorrection.gamma);
	controls.children[5].children[1].children[5].setValue(options.postEffect.colorCorrection.saturation);

	controls.children[5].children[2].children[0].setValue(options.postEffect.bloom.active);
	controls.children[5].children[2].children[1].setValue(options.postEffect.bloom.strength);
	controls.children[5].children[2].children[2].setValue(options.postEffect.bloom.threshold);
	controls.children[5].children[2].children[3].setValue(options.postEffect.bloom.blurSize);
	controls.children[5].children[2].children[4].setValue(options.postEffect.bloom.smoothWidth);

	controls.children[5].children[3].children[0].setValue(options.postEffect.ssao.active);
	controls.children[5].children[3].children[1].setValue(options.postEffect.ssao.radius);
	controls.children[5].children[3].children[2].setValue(options.postEffect.ssao.power);
	controls.children[5].children[3].children[3].setValue(options.postEffect.ssao.bias);
	controls.children[5].children[3].children[4].setValue(options.postEffect.ssao.intensity);
	controls.children[5].children[3].children[5].setValue(options.postEffect.ssao.quality);

	controls.children[5].children[4].children[0].setValue(options.postEffect.ssr.active);
	controls.children[5].children[4].children[1].setValue(options.postEffect.ssr.maxRayDistance);
	controls.children[5].children[4].children[2].setValue(options.postEffect.ssr.pixelStride);
	controls.children[5].children[4].children[3].setValue(options.postEffect.ssr.pixelStrideZCutoff);
	controls.children[5].children[4].children[4].setValue(options.postEffect.ssr.screenEdgeFadeStart);
	controls.children[5].children[4].children[5].setValue(options.postEffect.ssr.eyeFadeStart);
	controls.children[5].children[4].children[6].setValue(options.postEffect.ssr.eyeFadeEnd);
	controls.children[5].children[4].children[7].setValue(options.postEffect.ssr.minGlossiness);

	controls.children[5].children[5].children[0].setValue(options.postEffect.dof.active);
	controls.children[5].children[5].children[1].setValue(options.postEffect.dof.focalDepth);
	controls.children[5].children[5].children[2].setValue(options.postEffect.dof.focalLength);
	controls.children[5].children[5].children[3].setValue(options.postEffect.dof.fstop);
	controls.children[5].children[5].children[4].setValue(options.postEffect.dof.maxblur);
	controls.children[5].children[5].children[5].setValue(options.postEffect.dof.threshold);
	controls.children[5].children[5].children[6].setValue(options.postEffect.dof.gain);
	controls.children[5].children[5].children[7].setValue(options.postEffect.dof.bias);
	controls.children[5].children[5].children[8].setValue(options.postEffect.dof.dithering);

	controls.children[5].children[6].children[0].setValue(options.postEffect.fxaa.active);

	controls.children[5].children[7].children[0].setValue(options.postEffect.chromaticaberration.active);
	controls.children[5].children[7].children[1].setValue(options.postEffect.chromaticaberration.chromaFactor);

	controls.children[5].children[8].children[0].setValue(options.postEffect.vignetting.active);
	controls.children[5].children[8].children[1].setValue(options.postEffect.vignetting.color);
	controls.children[5].children[8].children[2].setValue(options.postEffect.vignetting.offset);

	controls.children[5].children[9].children[0].setValue(options.postEffect.bluredge.active);
	controls.children[5].children[9].children[1].setValue(options.postEffect.bluredge.offset);

	controls.children[5].children[10].children[0].setValue(options.postEffect.film.active);
	controls.children[5].children[10].children[1].setValue(options.postEffect.film.noiseIntensity);
	controls.children[5].children[10].children[2].setValue(options.postEffect.film.scanlinesIntensity);
	controls.children[5].children[10].children[3].setValue(options.postEffect.film.scanlinesCount);
	controls.children[5].children[10].children[4].setValue(options.postEffect.film.grayscale);

	controls.children[5].children[11].children[0].setValue(options.postEffect.glow.active);
	controls.children[5].children[11].children[1].setValue(options.postEffect.glow.strength);
	controls.children[5].children[11].children[2].setValue(options.postEffect.glow.radius);
	controls.children[5].children[11].children[3].setValue(options.postEffect.glow.threshold);
	controls.children[5].children[11].children[4].setValue(options.postEffect.glow.smoothWidth);

	controls.children[5].children[12].children[0].setValue(options.postEffect.lensflare.active);

	controls.children[6].children[0].setValue(options.debuggers.type);

	controls.children[7].children[2].setValue(options.animation.timeScale);
}