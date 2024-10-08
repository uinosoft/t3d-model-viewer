import { WebGLRenderer, AnimationMixer, AnimationAction, LoadingManager, RenderTargetBack, ShadowMapPass, Scene, Camera, Vector3, Vector2,
	ShaderMaterial, Mesh, PlaneGeometry, AmbientLight, DirectionalLight, Color3, TEXEL_ENCODING_TYPE,
	Box3, Sphere, DRAW_MODE, Spherical, SphereGeometry, PBRMaterial } from 't3d';
import { OrbitControls } from 't3d/addons/controls/OrbitControls.js';
import { Texture2DLoader } from 't3d/addons/loaders/Texture2DLoader.js';
import { RGBETexture2DLoader } from 't3d/addons/loaders/RGBELoader.js';
import { EXRTexture2DLoader } from 't3d/addons/loaders/EXRLoader.js';
import { PMREMGenerator } from 't3d/addons/textures/PMREMGenerator.js';
import { Timer } from 't3d/addons/misc/Timer.js';
import { SkyBox } from 't3d/addons/objects/SkyBox.js';
import { LensflareMarker } from 't3d-effect-composer/addons/lensflare/LensflareMarker.js';
import { Raycaster } from 't3d/addons/Raycaster.js';
import { ShadowAdapter } from 't3d/addons/math/ShadowAdapter.js';

import { default as TWEEN } from '@tweenjs/tween.js';
import Nanobar from 'nanobar';
import * as fflate from 'fflate';

import environmentMap from './configs/environments.json';
import { GroundShader } from './viewer/shader/GroundShader.js';
import { ViewerEffectComposer, geometryReplaceFunction } from './viewer/ViewerEffectComposer.js';
import { ColorSpaceType } from './Utils.js';
import { defaultGetDepthMaterialFn, defaultGetDistanceMaterialFn } from './viewer/ShadowMaterialCache.js';
import { GLTFModelLoader } from './loaders/GLTFModelLoader.js';

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

		const groundMaterial = new ShaderMaterial(GroundShader);
		groundMaterial.acceptLight = true;
		groundMaterial.uniforms.showGrid = true;
		const ground = new Mesh(
			new PlaneGeometry(1, 1),
			groundMaterial
		);
		ground.receiveShadow = true;
		groundMaterial.metalness = 0;
		groundMaterial.roughness = 1;
		groundMaterial.transparent = true;
		groundMaterial.polygonOffset = true;
		groundMaterial.polygonOffsetFactor = 1;
		groundMaterial.polygonOffsetUnits = 1;
		scene.add(ground);

		const focalTarget = new Mesh(new SphereGeometry(1, 12, 6), new PBRMaterial());
		focalTarget.scale.set(0.00001, 0.00001, 0.00001);
		focalTarget.material.diffuse.setHex(0xff0000);
		focalTarget.visible = false;
		scene.add(focalTarget);

		const cameraControl = new OrbitControls(camera, canvas);

		const ambientLight = new AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);

		const directionalLight = new DirectionalLight(0xffffff, 0.9);
		directionalLight.castShadow = true;
		directionalLight.shadow.flipSide = true;
		directionalLight.shadowAdapter = false;
		directionalLight.shadow.cameraNear = 1;
		directionalLight.shadow.cameraFar = 20;
		directionalLight.shadow.mapSize.set(2048, 2048);
		directionalLight.shadow.bias = -0.004;
		directionalLight.shadow.normalBias = 0.0;
		directionalLight.shadow.windowSize = 30;
		directionalLight.lookAt(new Vector3(), new Vector3(0, 1, 0));
		scene.add(directionalLight);

		const directionalLightCamera = new DirectionalLight(0xffffff, 0.2);
		directionalLightCamera.position.set(8, 3, 8);
		directionalLightCamera.lookAt(new Vector3(), new Vector3(0, 1, 0));
		scene.add(directionalLightCamera);

		const directionalLight2 = new DirectionalLight(0xffffff, 0);
		directionalLight2.shadowAdapter = false;
		directionalLight2.shadow.flipSide = true;
		directionalLight2.shadow.cameraNear = 1;
		directionalLight2.shadow.cameraFar = 20;
		directionalLight2.shadow.mapSize.set(2048, 2048);
		directionalLight2.shadow.bias = -0.004;
		directionalLight2.shadow.normalBias = 0.0;
		directionalLight2.shadow.windowSize = 30;
		directionalLight2.position.set(8, 3, 8);
		directionalLight2.lookAt(new Vector3(), new Vector3(0, 1, 0));
		scene.add(directionalLight2);

		const textureLoader = new Texture2DLoader();

		const lensflareMarker = new LensflareMarker();
		lensflareMarker.occlusionScale = 0.1;
		const textureFlare0 = textureLoader.load('./textures/lensflare/lensflare0.png');
		const textureFlare3 = textureLoader.load('./textures/lensflare/lensflare3.png');
		lensflareMarker.lensflareElements = [
			{ texture: textureFlare0, color: new Color3(0.2, 0.2, 0.2), scale: 0.6, offset: 0 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.05, offset: 0.6 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.06, offset: 0.7 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.1, offset: 0.9 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.06, offset: 1 }
		];
		lensflareMarker.visible = false;
		directionalLight.add(lensflareMarker);

		const lensflareMarker2 = new LensflareMarker();
		lensflareMarker2.occlusionScale = 0.1;
		lensflareMarker2.lensflareElements = [
			{ texture: textureFlare0, color: new Color3(0.2, 0.2, 0.2), scale: 0.6, offset: 0 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.05, offset: 0.6 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.06, offset: 0.7 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.1, offset: 0.9 },
			{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.06, offset: 1 }
		];
		lensflareMarker2.visible = false;
		directionalLight2.add(lensflareMarker2);

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
		this._directionalLight = directionalLight;
		this._directionalLightCamera = directionalLightCamera;
		this._directionalLight2 = directionalLight2;

		this._root = null;
		this._diagonal = new Vector3();
		this._diameter = null;
		this._wireframe = null;
		this.animations = null;
		this.actions = null;
		this.actionStates = null;
		this.timeScale = 1;

		this._cameraClip = {
			near: 1,
			far: 1000
		};
		this._boundingBox = new Box3();
		this._boundingSphere = new Sphere();
		this._lightCoord = new Vector2(30, 40);
		updateLightDirection(this._directionalLight, this._lightCoord, 10);
		updateLightDirection(this._directionalLight2, this._lightCoord, 10);

		this._animationFrame = null;
		this._running = false;

		this._updatedBoundingBoxByAction = false;

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
				this.updateBoundingBox();
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

		updateLightDirectionByShadowAdapter(this._directionalLight, this._camera, this._boundingBox, this._boundingSphere);
		updateLightDirectionByShadowAdapter(this._directionalLight2, this._camera, this._boundingBox, this._boundingSphere);

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

	updateBoundingBox() {
		if (this._updatedBoundingBoxByAction) return;
		// The boundingBox is updated only when the animation is playing
		if (this._root && this.actions) {
			for (let i = 0; i < this.actions.length; i++) {
				if (this.actionStates[this.actions[i].clip.name]) {
					getBoundingBox(this._root, this._boundingBox);
					setBoundingSphereByBox(this._boundingBox, this._boundingSphere);
					this.setCameraState();
					this._updatedBoundingBoxByAction = true;
					break;
				}
			}
		}
	}

	resize() {
		const { clientHeight, clientWidth } = this.el;
		this._canvas.style.width = clientWidth + 'px';
		this._canvas.style.height = clientHeight + 'px';

		const width = this._canvas.clientWidth || 2;
		const height = this._canvas.clientHeight || 2;

		const aspect = height / width;

		if (this._cameraDefault === 'perspective') {
			this._camera.setPerspective(this._fov / 180 * Math.PI, width / height, this._cameraClip.near, this._cameraClip.far);
		} else {
			this._camera.setOrtho(-this._diameter * 2, this._diameter * 2, -this._diameter * 2 * aspect, this._diameter * 2 * aspect, -this._cameraClip.far, this._cameraClip.far);
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
					this._boundingBox = new Box3();
					blobURLs.forEach(URL.revokeObjectURL);
					const root = gltf.root;
					root.traverse(node => {
						if (node.isMesh) {
							node.castShadow = true;
							node.receiveShadow = true;
						}

						if (node.material) {
							node.material.__drawMode = node.material.drawMode;
							node.material.drawMode = this._wireframe ? DRAW_MODE.LINES : node.material.__drawMode;
							node.material.wireframe = this._wireframe || false;
							const emissive = node.material.emissive;
							if (emissive.r + emissive.g + emissive.b > 0.0) {
								node.effects = { 'Glow': 1 };
							}
							if (node.material.type === 'basic') {
								// remove envMap effect for basic material
								node.material.envMap = undefined;
							}
						}

						if (!_rootBones.includes(node) && node.isBone && !node.parent.isBone) {
							_rootBones.push(node);
						}
					});

					gltf.animations && this.setClips(gltf.animations);

					getBoundingBox(root, this._boundingBox);
					setBoundingSphereByBox(this._boundingBox, this._boundingSphere);
					const center = this._boundingSphere.center;
					root.position.x += (root.position.x - center.x);
					root.position.y += (root.position.y - center.y);
					root.position.z += (root.position.z - center.z);
					getBoundingBox(root, this._boundingBox); // For models without animation

					this.setCameraState(true);

					this._ground.position.y = -Math.abs(this._diagonal.y / 2);
					const groundSize = Math.max(30, Math.abs(Math.max(this._diagonal.x, this._diagonal.z) * 2));
					this._ground.scale.set(groundSize, 1, groundSize);
					let size = Math.abs(Math.max(this._diagonal.x, this._diagonal.z) * 2);
					size = Math.max(30, size);
					this._ground.material.uniforms.size = size / 2;
					this._ground.material.uniforms.gridSize = size / 10;
					this._ground.material.uniforms.gridSize2 = size / 50;

					updateLightDirection(this._directionalLight, this._lightCoord, this._boundingSphere.radius);
					updateLightDirection(this._directionalLight2, this._lightCoord, this._boundingSphere.radius);

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
		this._ground.visible = options.show;
		this._ground.material.uniforms.color = [parseInt(options.color.charAt(1) + options.color.charAt(2), 16) / 255, parseInt(options.color.charAt(3) + options.color.charAt(4), 16) / 255, parseInt(options.color.charAt(5) + options.color.charAt(6), 16) / 255, 1];
		this._ground.material.uniforms.showGrid = options.grid;
		let size = Math.abs(Math.max(this._diagonal.x, this._diagonal.z) * 2);
		size = Math.max(30, size);
		this._ground.material.uniforms.size = size / 2;
		this._ground.material.uniforms.gridSize = size / 10;
		this._ground.material.uniforms.gridSize2 = size / 50;

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
		this._scene.environmentLightIntensity = options.diffuseIntensity;
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

			this._lightCoord = options.direction;
			updateLightDirection(this._directionalLight, this._lightCoord, this._boundingSphere.radius);

			this._directionalLight.children[0].visible = options.lensflare;
		}

		if (light == 2) {
			this._directionalLight2.intensity = options.intensity;

			setColor(this._directionalLight2.color, options.color);

			this._lightCoord = options.direction;
			updateLightDirection(this._directionalLight2, this._lightCoord, this._boundingSphere.radius);

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
		this._dirty = true;
	}

	setCamera(options) {
		this._fov = options.fov;

		const width = this._canvas.clientWidth || 2;
		const height = this._canvas.clientHeight || 2;
		const aspect = height / width;
		if (options.type === 'perspective') {
			this._camera.setPerspective(this._fov / 180 * Math.PI, width / height, this._cameraClip.near, this._cameraClip.far);
			this._camera.add(this._skyBox);
			this._cameraDefault = 'perspective';
		} else {
			this._camera.setOrtho(-this._diameter * 2, this._diameter * 2, -this._diameter * 2 * aspect, this._diameter * 2 * aspect, -this._cameraClip.far, this._cameraClip.far);
			this._camera.remove(this._skyBox);
			this._cameraDefault = 'othographic';
		}

		const encoding = ColorSpaceType[options.outputEncoding] || TEXEL_ENCODING_TYPE.LINEAR;
		this._camera.outputEncoding = encoding;
		this._effectComposer.getBuffer('SceneBuffer').setOutputEncoding(encoding);

		this._dirty = true;
	}

	setCameraState(resetStart) {
		this._diagonal.subVectors(this._boundingBox.max, this._boundingBox.min);
		const diameter = this._diagonal.getLength();
		this._diameter = diameter;

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
			spherical.radius = this._boundingSphere.radius * cameraDefaultView.start[2];
			spherical.phi = cameraDefaultView.start[0] * Math.PI / 180;
			spherical.theta = cameraDefaultView.start[1] * Math.PI / 180;
			this._camera.position.setFromSpherical(spherical);
		} else {
			this._camera.position.copy(oldStart);
		}

		spherical.radius = this._boundingSphere.radius * cameraDefaultView.to[2];
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
		const focalScale = this._boundingSphere.radius / 100;
		this._focalTarget.scale.set(focalScale, focalScale, focalScale);
		this._focalTarget.position.fromArray(target);

		this._dirty = true;
	}

	clear() {
		if (!this._root) return;

		_rootBones = [];
		this._updatedBoundingBoxByAction = false;

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

let _rootBones = [];
const _childBox = new Box3();
const _pos = new Vector3();

function getBoundingBox(object, target) {
	_pos.set(0, 0, 0);
	_childBox.makeEmpty();
	target.makeEmpty();
	object.updateMatrix();

	object.traverse(node => {
		if (node.geometry) {
			if (node.isSkinnedMesh) {
				node.geometry.computeBoundingBox();
				_childBox.copy(node.geometry.boundingBox);
				_rootBones.forEach(rootbone => {
					const rootIndex = node.skeleton.bones.indexOf(rootbone);
					if (rootIndex !== -1) {
						_childBox.applyMatrix4(node.skeleton.boneInverses[rootIndex]);
						_childBox.applyMatrix4(rootbone.worldMatrix);
						target.expandByBox3(_childBox);
					}
				});
			} else if (node.morphTargetInfluences) {
				morphTransform(node, _childBox, _pos);
				_childBox.applyMatrix4(node.worldMatrix);
				target.expandByBox3(_childBox);
			} else {
				node.geometry.computeBoundingBox();
				_childBox.copy(node.geometry.boundingBox).applyMatrix4(node.worldMatrix);
				target.expandByBox3(_childBox);
			}
		}
	});

	return target;
}

function setBoundingSphereByBox(box, target) {
	box.getCenter(target.center);

	const diagonal = new Vector3().subVectors(box.max, box.min);
	target.radius = diagonal.getLength() / 2;

	return target;
}

function updateLightDirection(light, coord, radius) {
	light.phi = Math.PI / 2 - coord.y * Math.PI / 180;
	light.theta = coord.x * Math.PI / 180;

	if (light.shadowAdapter) return;

	const spherical = new Spherical(radius, light.phi, light.theta);
	const position = new Vector3().setFromSpherical(spherical);

	light.position.set(position.x, position.y, position.z);

	light.lookAt(new Vector3(), new Vector3(0, 1, 0));

	light.shadow.windowSize = radius * 10;
	light.shadow.cameraNear = radius / 50;
	light.shadow.cameraFar = radius * 5;
}

const _shadowAdapterSphere = new Sphere();
function updateLightDirectionByShadowAdapter(light, camera, box, sphere) {
	if (!light.shadowAdapter) return;

	ShadowAdapter.getSphereByBox3AndCamera(box, camera, 1, sphere.radius * 2 * light.shadowDistanceScale, _shadowAdapterSphere);
	ShadowAdapter.setDirectionalLight(light, light.phi, light.theta, _shadowAdapterSphere);
	light.shadow.cameraFar = light.shadow.cameraNear + sphere.radius * 5; // fix camera length
}

// morphTransform
// if (node.morphTargetInfluences)
const _morph = new Vector3();
const _temp = new Vector3();

function morphTransform(node, childBox, pos) {
	const index = node.geometry.index.buffer.array;
	const position = node.geometry.getAttribute('a_Position');
	childBox.makeEmpty();
	for (let i = 0; i < index.length; i += 1) {
		const a = index[i];
		pos.fromArray(position.buffer.array, a * 3);
		morphNodeTransform(node, a, pos);
		childBox.expandByPoint(pos);
	}
	return childBox;
}

function morphNodeTransform(object, index, target) {
	const morphPosition = object.geometry.morphAttributes.position;
	const morphInfluences = object.morphTargetInfluences;
	_morph.set(0, 0, 0);
	_temp.set(0, 0, 0);
	for (let i = 0; i < morphPosition.length; i++) {
		const influence = morphInfluences[i];
		const morphAttribute = morphPosition[i];
		if (influence === 0 || influence - 0 < Number.EPSILON) continue;
		_temp.fromArray(morphAttribute.buffer.array, index * 3);
		_morph.addScaledVector(_temp, influence);
	}
	target.add(_morph);
	return target;
}

function hasRunningAction(actions) {
	for (let i = 0; i < actions.length; i++) {
		if (actions[i].weight > 0) {
			return true;
		}
	}
	return false;
}