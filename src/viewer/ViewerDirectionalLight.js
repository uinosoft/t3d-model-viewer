import { DirectionalLight, Color3, Spherical, Vector3, Sphere } from 't3d';
import { Texture2DLoader } from 't3d/addons/loaders/Texture2DLoader.js';
import { ShadowAdapter } from 't3d/addons/math/ShadowAdapter.js';

import { LensflareMarker } from 't3d-effect-composer/addons/lensflare/LensflareMarker.js';

export class ViewerDirectionalLight extends DirectionalLight {

	constructor(color, intensity) {
		super(color, intensity);

		this.shadow.cameraNear = 1;
		this.shadow.cameraFar = 20;
		this.shadow.mapSize.set(2048, 2048);
		this.shadow.bias = -0.004;
		this.shadow.normalBias = 0.0;
		this.shadow.windowSize = 30;

		this.shadow.flipSide = true;

		const lensflareMarker = new LensflareMarker();
		lensflareMarker.occlusionScale = 0.1;
		lensflareMarker.lensflareElements = getLensflareElements();
		lensflareMarker.visible = false;
		this.add(lensflareMarker);

		this._phi = 0;
		this._theta = 0;

		this.setDirection({ x: 30, y: 40 });
		this._updateDirection(10);
	}

	setDirection(coord) {
		this._phi = Math.PI / 2 - coord.y * Math.PI / 180;
		this._theta = coord.x * Math.PI / 180;
	}

	updateDirection(camera, box, sphere) {
		if (this.shadowAdapter) {
			this._updateDirectionByShadowAdapter(camera, box, sphere);
		} else {
			this._updateDirection(sphere.radius);
		}
	}

	_updateDirection(radius) {
		_spherical.set(radius, this._phi, this._theta);
		this.position.setFromSpherical(_spherical);

		this.lookAt(_target, _up);

		this.shadow.windowSize = radius * 10;
		this.shadow.cameraNear = radius / 50;
		this.shadow.cameraFar = radius * 5;
	}

	_updateDirectionByShadowAdapter(camera, box, sphere) {
		ShadowAdapter.getSphereByBox3AndCamera(box, camera, 1, sphere.radius * 2 * this.shadowDistanceScale, _shadowAdapterSphere);
		ShadowAdapter.setDirectionalLight(this, this._phi, this._theta, _shadowAdapterSphere);
		this.shadow.cameraFar = this.shadow.cameraNear + sphere.radius * 5; // fix camera length
	}

}

const _shadowAdapterSphere = new Sphere();
const _spherical = new Spherical();
const _target = new Vector3();
const _up = new Vector3(0, 1, 0);

let textureLoader = null;
let textureFlare0 = null;
let textureFlare3 = null;

function getLensflareElements() {
	if (!textureLoader) {
		textureLoader = new Texture2DLoader();
		textureFlare0 = textureLoader.load('./textures/lensflare/lensflare0.png');
		textureFlare3 = textureLoader.load('./textures/lensflare/lensflare3.png');
	}

	return [
		{ texture: textureFlare0, color: new Color3(0.2, 0.2, 0.2), scale: 0.6, offset: 0 },
		{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.05, offset: 0.6 },
		{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.06, offset: 0.7 },
		{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.1, offset: 0.9 },
		{ texture: textureFlare3, color: new Color3(1, 1, 1), scale: 0.06, offset: 1 }
	];
}