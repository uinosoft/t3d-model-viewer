import { WebGLRenderer, AnimationMixer, AnimationAction, LoadingManager, RenderTargetBack, ShadowMapPass, Scene, Camera,
	Vector3, Vector2, Mesh, AmbientLight, DirectionalLight, TEXEL_ENCODING_TYPE,
	DRAW_MODE, Spherical, SphereGeometry, PBRMaterial } from 't3d';
import { OrbitControls } from 't3d/addons/controls/OrbitControls.js';
import { Texture2DLoader } from 't3d/addons/loaders/Texture2DLoader.js';
import { RGBETexture2DLoader } from 't3d/addons/loaders/RGBELoader.js';
import { EXRTexture2DLoader } from 't3d/addons/loaders/EXRLoader.js';
import { PMREMGenerator } from 't3d/addons/textures/PMREMGenerator.js';
import { Timer } from 't3d/addons/misc/Timer.js';
import { SkyBox } from 't3d/addons/objects/SkyBox.js';
import { Raycaster } from 't3d/addons/Raycaster.js';
import { Box3Helper } from 't3d/addons/objects/Box3Helper.js';

import { default as TWEEN } from '@tweenjs/tween.js';
import Nanobar from 'nanobar';
import * as fflate from 'fflate';

import environmentMap from './configs/environments.json';
import { ViewerEffectComposer, geometryReplaceFunction } from './viewer/ViewerEffectComposer.js';
import { ColorSpaceType } from './Utils.js';
import { defaultGetDepthMaterialFn, defaultGetDistanceMaterialFn } from './viewer/ShadowMaterialCache.js';
import { GLTFModelLoader } from './loaders/GLTFModelLoader.js';
import { ViewerDirectionalLight } from './viewer/ViewerDirectionalLight.js';
import { ViewerGround } from './viewer/ViewerGround.js';
import { ModelBounds } from './viewer/ModelBounds.js';

export class Viewer {

	constructor(el) {
		this.el = el;

		const canvas = document.createElement('canvas');
		canvas.width = el.clientWidth * window.devicePixelRatio;
		canvas.height = el.clientHeight * window.devicePixelRatio;
		canvas.style.width = el.clientWidth + 'px';
		canvas.style.height = el.clientHeight + 'px';
		this.el.appendChild(canvas);

		const width = canvas.clientWidth || 2;
		const height = canvas.clientHeight || 2;

		const gl = canvas.getContext('webgl2', {
			antialias: true,
			alpha: false,
			stencil: true
		});

		const renderer = new WebGLRenderer(gl);
		renderer.setClearColor(0.2, 0.2, 0.2, 1);

		this.timer = new Timer();

		const backRenderTarget = new RenderTargetBack(canvas);
		backRenderTarget.resize(width, height);

		const shadowMapPass = new ShadowMapPass();
		shadowMapPass.getGeometry = geometryReplaceFunction;
		shadowMapPass.getDepthMaterial = defaultGetDepthMaterialFn;
		shadowMapPass.getDistanceMaterial = defaultGetDistanceMaterialFn;

		const effectComposer = new ViewerEffectComposer(width, height, renderer);

		const scene = new Scene();

		const fov = 45;

		const camera = new Camera();
		camera.lookAt(new Vector3(0, 0, 0), new Vector3(0, 1, 0));
		camera.setPerspective(fov / 180 * Math.PI, width / height, 1, 1000);
		scene.add(camera);

		const skyBox = new SkyBox();
		skyBox.gamma = true;
		skyBox.level = 8;
		skyBox.renderLayer = 2;
		camera.add(skyBox);

		const ground = new ViewerGround();
		scene.add(ground);

		const focalTarget = new Mesh(new SphereGeometry(1, 12, 6), new PBRMaterial());
		focalTarget.scale.set(0.00001, 0.00001, 0.00001);
		focalTarget.material.diffuse.setHex(0xff0000);
		focalTarget.visible = false;
		scene.add(focalTarget);

		const cameraControl = new OrbitControls(camera, canvas);

		const ambientLight = new AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);

		const directionalLightCamera = new DirectionalLight(0xffffff, 0.2);
		directionalLightCamera.position.set(8, 3, 8);
		directionalLightCamera.lookAt(new Vector3(), new Vector3(0, 1, 0));
		scene.add(directionalLightCamera);

		const directionalLight = new ViewerDirectionalLight(0xffffff, 0.9);
		directionalLight.castShadow = true;
		directionalLight.shadowAdapter = false;
		scene.add(directionalLight);

		const directionalLight2 = new ViewerDirectionalLight(0xffffff, 0);
		directionalLight2.shadowAdapter = false;
		scene.add(directionalLight2);

		const modelBounds = new ModelBounds();

		const boundsHelper = new Box3Helper(modelBounds.box);
		boundsHelper.material.envMap = undefined;
		boundsHelper.visible = false;
		scene.add(boundsHelper);

		const textureLoader = new Texture2DLoader();

		camera.gammaFactor = 2.0;
		camera.outputEncoding = TEXEL_ENCODING_TYPE.SRGB;

		const nanobar = new Nanobar();

		this._modelLoadManager = new LoadingManager(function() {
			nanobar.go(100);
			// nanobar.el.style.background = "transparent";
		}, function(url, itemsLoaded, itemsTotal) {
			if (itemsLoaded < itemsTotal) {
				nanobar.go(itemsLoaded / itemsTotal * 100);
			}
		});

		this._modelLoader = new GLTFModelLoader(this._modelLoadManager, renderer);

		EXRTexture2DLoader.setfflate(fflate);

		this._textureLoader = textureLoader;

		this._rgbeTextureLoader = new RGBETexture2DLoader();
		this._exrTextureLoader = new EXRTexture2DLoader();

		this._pmremGenerator = new PMREMGenerator(1024);

		this.setEnvironmentTexture('Ice_Lake');

		// this._pixelRatio = pixelRatio;
		this._canvas = canvas;
		this._gl = gl;
		this._renderer = renderer;
		this._backRenderTarget = backRenderTarget;
		this._shadowMapPass = shadowMapPass;
		this._effectComposer = effectComposer;
		this._scene = scene;
		this._camera = camera;
		this._cameraDefault = 'perspective';
		this._fov = fov;
		this._skyBox = skyBox;
		this._ground = ground;
		this._cameraControl = cameraControl;
		this._ambientLight = ambientLight;
		this._directionalLightCamera = directionalLightCamera;
		this._directionalLight = directionalLight;
		this._directionalLight2 = directionalLight2;

		this._root = null;
		this._wireframe = null;
		this.animations = null;
		this.actions = null;
		this.actionStates = null;
		this.timeScale = 1;

		this._cameraClip = {
			near: 1,
			far: 1000
		};
		this._modelBounds = modelBounds;
		this._boundsHelper = boundsHelper;

		this._animationFrame = null;
		this._running = false;

		this._cameraDefaultView = {
			start: [60, 10, 8],
			to: [80, 45, 2.6]
		};
		this._cameraTween = null;

		this._raycaster = new Raycaster();
		this._focalTarget = focalTarget;

		this._dirty = true;
		this._staticCount = 0;
	}

	startRender() {
		const loop = timeStamp => {
			if (this._running) {
				this._animationFrame = requestAnimationFrame(loop);
				this.tick(timeStamp);
			}
		};

		this._running = true;
		this._animationFrame = requestAnimationFrame(loop);
	}

	stopRender() {
		this._running = false;

		if (this._animationFrame !== null) {
			cancelAnimationFrame(this._animationFrame);
			this._animationFrame = null;
		}
	}

	tick(timestamp) {
		TWEEN.update();

		let renderDirty = this._cameraControl.update() || this._dirty;

		this._scene.updateMatrix();
		this._scene.updateRenderStates(this._camera);
		this._scene.updateRenderQueue(this._camera);

		this.timer.update(timestamp);

		this._shadowMapPass.render(this._renderer, this._scene);

		if (this.animations) {
			this.animations.update(this.timer.getDelta() * this.timeScale);
			if (hasRunningAction(this.animations.getActions())) {
				renderDirty = true;
			}
		}

		this._directionalLightCamera.position.set(this._camera.position.x, this._camera.position.y, this._camera.position.z);
		this._directionalLightCamera.lookAt(new Vector3(0, 0, 0), new Vector3(0, 1, 0));

		this._directionalLight.updateDirection(this._camera, this._modelBounds);
		this._directionalLight2.updateDirection(this._camera, this._modelBounds);

		const focalTargetViewPos = _vec3_1.copy(this._focalTarget.position).applyMatrix4(this._camera.viewMatrix);
		this._effectComposer.updateDOFFocalDepth(-focalTargetViewPos.z);

		if (renderDirty) {
			this._staticCount = 10;
			this._dirty = false;
		}

		this._staticCount--;
		if (this._staticCount > 0) {
			this._effectComposer.dirty();
		}

		this._effectComposer.render(this._renderer, this._scene, this._camera, this._backRenderTarget);
	}

	resize() {
		const { clientHeight, clientWidth } = this.el;
		this._canvas.style.width = clientWidth + 'px';
		this._canvas.style.height = clientHeight + 'px';

		const width = this._canvas.clientWidth || 2;
		const height = this._canvas.clientHeight || 2;

		const aspect = height / width;
		const { diameter } = this._modelBounds;

		if (this._cameraDefault === 'perspective') {
			this._camera.setPerspective(this._fov / 180 * Math.PI, width / height, this._cameraClip.near, this._cameraClip.far);
		} else {
			this._camera.setOrtho(-diameter * 2, diameter * 2, -diameter * 2 * aspect, diameter * 2 * aspect, -this._cameraClip.far, this._cameraClip.far);
		}
		this._backRenderTarget.resize(width, height);
		this._effectComposer.resize(width, height);

		this._dirty = true;
	}

	load(url, rootPath, assetMap) {
		this._ground.visible = false;
		const baseURL = this.extractUrlBase(url);

		// Load.
		return new Promise((resolve, reject) => {
			const blobURLs = [];

			// Intercept and override relative URLs.
			this._modelLoadManager.setURLModifier((url, path) => {
				const normalizedURL = rootPath + decodeURI(url)
					.replace(baseURL, '')
					.replace(/^(\.?\/)/, '');

				if (assetMap && assetMap.has(normalizedURL)) {
					const blob = assetMap.get(normalizedURL);
					const blobURL = URL.createObjectURL(blob);
					blobURLs.push(blobURL);
					return blobURL;
				}

				return (path || '') + url;
			});

			this._modelLoader.load(url)
				.then(gltf => {
					this._ground.visible = true;

					this.clear();

					this._modelBounds.makeEmpty();

					blobURLs.forEach(URL.revokeObjectURL);

					let transmission = false, glow = false;

					const root = gltf.root;
					root.traverse(node => {
						if (node.isMesh) {
							node.castShadow = true;
							node.receiveShadow = true;
						}

						if (node.material) {
							if (node.material.__drawMode === undefined) {
								node.material.__drawMode = node.material.drawMode;
							}
							node.material.drawMode = this._wireframe ? DRAW_MODE.LINES : node.material.__drawMode;
							node.material.wireframe = this._wireframe || false;
							const emissive = node.material.emissive;
							if (emissive.r + emissive.g + emissive.b > 0.0) {
								node.effects = { 'Glow': 1 };
								glow = true;
							}
							if (node.material.type === 'basic') {
								// remove envMap effect for basic material
								node.material.envMap = undefined;
							}
							if (node.material.shaderName === 'TransmissionPBR') {
								node.renderLayer = 20;
								transmission = true;
							}
						}

						this._modelBounds.collectRootBones(node);
					});

					gltf.animations && this.setClips(gltf.animations);
					this.animations && this.animations.update(0); // apply frame 0

					// compute boundings
					this._modelBounds.computeBounds(root);

					// move model to center
					const center = this._modelBounds.center;
					const offset = _vec3_1.subVectors(root.position, center);
					root.position.add(offset);

					// fix boundings
					this._modelBounds.move(offset);

					this.setCameraState(true);

					this._ground.fitSize(this._modelBounds.diagonal);

					this._effectComposer.getEffect('Transmission').active = transmission;
					this._effectComposer.getEffect('Glow').active = glow;

					this._root = root;
					this._scene.add(root);
					resolve(gltf);
					printGraph(root, true);
				});
		});
	}

	setClips(clips) {
		if (!clips.length) return;

		this.animations = new AnimationMixer();
		clips.forEach(clip => {
			const action = this.actions = new AnimationAction(clip);
			this.animations.addAction(action);
		});
		this.actions = this.animations.getActions();

		const actionIndex = 0;

		this.actions[actionIndex].time = 0;
		this.actions[actionIndex].weight = 1;
	}

	playAllClips() {
		this.actions.forEach(actions => {
			if (!this.actionStates[actions.clip.name]) {
				actions.time = 0;
				actions.weight = 1;
				this.actionStates[actions.clip.name] = true;
			}
		});
	}
	stopAllClips() {
		if (!this.actions) return;

		this.actions.forEach(actions => {
			if (this.actionStates[actions.clip.name]) {
				actions.time = 0;
				actions.weight = 0;
				this.actionStates[actions.clip.name] = false;
			}
		});
	}

	setGlobal(options) {
		if (!this._root) return;

		this._wireframe = options.wireframe;

		this._root.traverse(node => {
			if (node.material) {
				const originDrawMode = node.material.__drawMode || DRAW_MODE.TRIANGLES;
				node.material.drawMode = this._wireframe ? DRAW_MODE.LINES : originDrawMode;
				node.material.wireframe = this._wireframe;
			}
		});

		this._dirty = true;
	}

	setGround(options) {
		this._ground.setStyle(options);
		this._dirty = true;
	}

	setEnvironmentTexture(key) {
		const { name, ext, tex } = environmentMap[key];

		if (tex) {
			this._scene.environment = tex;
			this._skyBox.texture = tex;
			this._dirty = true;
		} else {
			this.setEnvironmentTextureByURL(`./textures/${name}.${ext}`).then(texture => {
				environmentMap[key].tex = texture;
			});
		}
	}

	setEnvironmentTextureByURL(url, isEXR = false) {
		const loader = isEXR ? this._exrTextureLoader : this._rgbeTextureLoader;
		return loader.loadAsync(url).then(texture => {
			return this._pmremGenerator.prefilter(this._renderer, texture);
		}).then(texture => {
			this._scene.environment = texture;
			this._skyBox.texture = texture;

			this._dirty = true;

			return texture;
		});
	}

	setEnvironmentParams(options) {
		this._scene.envDiffuseIntensity = options.diffuseIntensity;
		this._scene.envSpecularIntensity = options.specularIntensity;
		this._skyBox.level = options.skyRoughness;

		this._dirty = true;
	}

	setAmbientLight(options) {
		this._ambientLight.intensity = options.intensity;

		setColor(this._ambientLight.color, options.color);

		this._dirty = true;
	}

	setDirectionalLight(options, light) {
		if (light == 0) {
			this._directionalLightCamera.intensity = options.intensity;
			setColor(this._directionalLightCamera.color, options.color);
		}

		if (light == 1) {
			this._directionalLight.intensity = options.intensity;

			setColor(this._directionalLight.color, options.color);

			this._directionalLight.setDirection(options.direction);

			this._directionalLight.children[0].visible = options.lensflare;
		}

		if (light == 2) {
			this._directionalLight2.intensity = options.intensity;

			setColor(this._directionalLight2.color, options.color);

			this._directionalLight2.setDirection(options.direction);

			this._directionalLight2.children[0].visible = options.lensflare;
		}

		this._dirty = true;
	}

	setPostEffect(options) {
		this._effectComposer.setOptions(options);
		this._dirty = true;
	}

	setDebugger(options) {
		this._effectComposer.setDebugger(options);
		this._focalTarget.visible = options.showPickFocus;
		this._boundsHelper.visible = options.showBounds;
		this._dirty = true;
	}

	setCamera(options) {
		this._fov = options.fov;

		const width = this._canvas.clientWidth || 2;
		const height = this._canvas.clientHeight || 2;
		const aspect = height / width;
		const { diameter } = this._modelBounds;
		if (options.type === 'perspective') {
			this._camera.setPerspective(this._fov / 180 * Math.PI, width / height, this._cameraClip.near, this._cameraClip.far);
			this._camera.add(this._skyBox);
			this._cameraDefault = 'perspective';
		} else {
			this._camera.setOrtho(-diameter * 2, diameter * 2, -diameter * 2 * aspect, diameter * 2 * aspect, -this._cameraClip.far, this._cameraClip.far);
			this._camera.remove(this._skyBox);
			this._cameraDefault = 'othographic';
		}

		const encoding = ColorSpaceType[options.outputEncoding] || TEXEL_ENCODING_TYPE.LINEAR;
		this._camera.outputEncoding = encoding;
		this._effectComposer.getBuffer('SceneBuffer').setOutputEncoding(encoding);

		this._dirty = true;
	}

	setCameraState(resetStart) {
		const { diameter } = this._modelBounds;

		const oldStart = this._camera.position.clone();

		this._cameraControl.reset();
		this._cameraControl.maxDistance = diameter * 10;

		const { clientWidth, clientHeight } = this._canvas;
		const cameraNear = diameter / 100, cameraFar = diameter * 100;
		const aspect = clientHeight / clientWidth;
		if (this._cameraDefault === 'perspective') {
			this._camera.setPerspective(this._fov / 180 * Math.PI, clientWidth / clientHeight, cameraNear, cameraFar);
			this._camera.add(this._skyBox);
		} else {
			this._camera.setOrtho(-diameter * 2, diameter * 2, -diameter * 2 * aspect, diameter * 2 * aspect, -cameraFar, cameraFar);
			this._camera.remove(this._skyBox);
		}

		const cameraDefaultView = this._cameraDefaultView;
		const spherical = new Spherical();

		if (resetStart) {
			spherical.radius = diameter * 0.5 * cameraDefaultView.start[2];
			spherical.phi = cameraDefaultView.start[0] * Math.PI / 180;
			spherical.theta = cameraDefaultView.start[1] * Math.PI / 180;
			this._camera.position.setFromSpherical(spherical);
		} else {
			this._camera.position.copy(oldStart);
		}

		spherical.radius = diameter * 0.5 * cameraDefaultView.to[2];
		spherical.phi = cameraDefaultView.to[0] * Math.PI / 180;
		spherical.theta = cameraDefaultView.to[1] * Math.PI / 180;
		this.runCameraAnimation(new Vector3().setFromSpherical(spherical));

		this._cameraClip.near = cameraNear;
		this._cameraClip.far = cameraFar;

		this._cameraControl.saveState();

		this._dirty = true;
	}

	runCameraAnimation(toPos) {
		if (this._cameraTween) {
			this._cameraTween.stop();
			this._cameraTween = null;
		}

		this._cameraTween = new TWEEN.Tween(this._camera.position)
			.to(toPos, 800)
			.easing(TWEEN.Easing.Quartic.InOut)
			.delay(200)
			.start()
			.onUpdate(() => {
				this._dirty = true;
			})
			.onComplete(() => {
				this._cameraTween.stop();
				this._cameraTween = null;
			})
			.onStop(() => {
				this._cameraTween.stop();
				this._cameraTween = null;
			});
	}

	updateCameraView(options) {
		if (!options) return;

		if (options.camera) {
			this.runCameraAnimation(new Vector3().fromArray(options.camera));
		}

		if (options.target) {
			this._cameraControl.target = new Vector3().fromArray(options.target);
		}

		this._dirty = true;
	}

	exportCameraView(options) {
		const cameraPos = this._camera.position;
		const cameraTarget = this._cameraControl.target;
		if (!options.cameraView) options.cameraView = {};
		options.cameraView.camera = [cameraPos.x, cameraPos.y, cameraPos.z];
		options.cameraView.target = [cameraTarget.x, cameraTarget.y, cameraTarget.z];
	}

	setShadow(options, light) {
		if (light == 1) {
			this._directionalLight.castShadow = options.shadowenable;
			this._directionalLight.shadow.bias = options.shadowbias;
			this._directionalLight.shadow.normalBias = options.shadowNormalBias;
			const mapSize = ({ 'Ultra': 4096, 'High': 2048, 'Medium': 1024, 'Low': 512 })[options.shadowquality];
			this._directionalLight.shadow.mapSize.set(mapSize, mapSize);
			this._directionalLight.shadowAdapter = options.shadowAdapter;
			this._directionalLight.shadowDistanceScale = options.shadowDistanceScale;
			this._directionalLight.shadow.flipSide = options.shadowFlipSide;
		}
		if (light == 2) {
			this._directionalLight2.castShadow = options.shadowenable;
			this._directionalLight2.shadow.bias = options.shadowbias;
			this._directionalLight2.shadow.normalBias = options.shadowNormalBias;
			const mapSize = ({ 'Ultra': 4096, 'High': 2048, 'Medium': 1024, 'Low': 512 })[options.shadowquality];
			this._directionalLight2.shadow.mapSize.set(mapSize, mapSize);
			this._directionalLight2.shadowAdapter = options.shadowAdapter;
			this._directionalLight2.shadowDistanceScale = options.shadowDistanceScale;
			this._directionalLight2.shadow.flipSide = options.shadowFlipSide;
		}

		this._dirty = true;
	}

	pickModel(event) {
		if (!this._root) return null;

		_vec2_1.x = (event.offsetX / this._canvas.width) * 2 - 1;
		_vec2_1.y = -(event.offsetY / this._canvas.height) * 2 + 1;

		this._raycaster.setFromCamera(_vec2_1, this._camera);
		const intersects = this._raycaster.intersectObject(this._root, true);
		const intersect = intersects.find(el => el.object.userData.pickable !== false);

		return intersect;
	}

	updateFocalTarget(target) {
		const focalScale = this._modelBounds.diameter / 200;
		this._focalTarget.scale.set(focalScale, focalScale, focalScale);
		this._focalTarget.position.fromArray(target);

		this._dirty = true;
	}

	clear() {
		if (!this._root) return;

		this._modelBounds.clearRootBones();

		this.stopAllClips();
		this.actions = [];

		this._scene.remove(this._root);

		// dispose geometry
		this._root.traverse(node => {
			if (!node.geometry) return;
			node.geometry.dispose();
		});

		this._renderer.clear(true, true, false);

		this._dirty = true;
	}

	extractUrlBase(url) {
		const index = url.lastIndexOf('/');
		if (index === -1) return './';
		return url.substr(0, index + 1);
	}

}

const _vec2_1 = new Vector2();
const _vec3_1 = new Vector3();

function printGraph(node, collapsed = false) {
	const text = ' <' + node.constructor.name + '> ' + node.name;
	collapsed ? console.groupCollapsed(text) : console.group(text);
	node.children.forEach(child => printGraph(child));
	console.groupEnd();
}

function setColor(color, hex) {
	color.r = parseInt(hex.charAt(1) + hex.charAt(2), 16) / 255;
	color.g = parseInt(hex.charAt(3) + hex.charAt(4), 16) / 255;
	color.b = parseInt(hex.charAt(5) + hex.charAt(6), 16) / 255;
}

function hasRunningAction(actions) {
	for (let i = 0; i < actions.length; i++) {
		if (actions[i].weight > 0) {
			return true;
		}
	}
	return false;
}