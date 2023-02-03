export class Options {

	constructor(viewer) {
		this.version = "0.0.1",
		this.global = {
			wireframe: false
		},
		this.ground = {
			show: true,
			color: '#ffffff',
			grid: true
		},
		this.environment = {
			texture: 'Ice_Lake',
			diffuseIntensity: 1,
			skyRoughness: 8
		},
		this.camera = {
			fov: 45,
			type: 'perspective',
			outputEncoding: 'Gamma'
		},
		this.light = {
			ambient: {
				intensity: 0.3,
				color: '#ffffff'
			},
			directional: {
				directional1: {
					intensity: 0.7,
					color: '#ffffff',
					direction: {
						x: 30, y: 40
					},
					lensflare: false,
					shadowenable: true,
					shadowbias: -0.004,
					shadowquality: 'High'
				},
				directional2: {
					intensity: 0,
					color: '#ffffff',
					direction: {
						x: 30, y: 40
					},
					lensflare: false,
					shadowenable: false,
					shadowbias: -0.004,
					shadowquality: 'High'
				},
				cameraDirectional: {
					intensity: 0.2,
					color: '#ffffff'
				}
			}
		},
		this.postEffect = {
			MSAA: true,
			colorCorrection: {
				active: false,
				brightness: 0,
				contrast: 1.02,
				exposure: 0,
				gamma: 1,
				saturation: 1.02
			},
			bloom: {
				active: false,
				strength: 1,
				threshold: 0.7,
				blurSize: 2,
				smoothWidth: 0.01
			},
			glow: {
				active: false,
				strength: 1,
				radius: 0.4,
				threshold: 0.01,
				smoothWidth: 0.1
			},
			ssao: {
				active: false,
				radius: 0.5,
				power: 1,
				bias: 0.1,
				intensity: 1,
				quality: 'Medium'
			},
			ssr: {
				active: false,
				maxRayDistance: 4,
				pixelStride: 16,
				pixelStrideZCutoff: 10,
				screenEdgeFadeStart: 0.9,
				eyeFadeStart: 0.4,
				eyeFadeEnd: 0.8,
				minGlossiness: 0.2
			},
			dof: {
				active: false,
				focalDepth: 1,
				focalLength: 24,
				fstop: 0.9,
				maxblur: 1.0,
				threshold: 0.9,
				gain: 1.0,
				bias: 0.5,
				dithering: 0.0001
			},
			fxaa: {
				active: false
			},
			chromaticaberration: {
				active: false,
				chromaFactor: 0.025
			},
			vignetting: {
				active: false,
				color: '#ffffff',
				offset: 1.0
			},
			bluredge: {
				active: false,
				offset: 1.0
			},
			film: {
				active: false,
				noiseIntensity: 0.35,
				scanlinesIntensity: 0.5,
				scanlinesCount: 2048,
				grayscale: true
			},
			lensflare: {
				active: true
			}
		},
		this.debuggers = {
			type: 'None'
		},
		this.animation = {
			playAll: function() { viewer.playAllClips() },
			stopAll: function() { viewer.stopAllClips() },
			timeScale: 1
		}
	}

}