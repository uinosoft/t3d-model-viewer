import { Mesh, PlaneGeometry, ShaderMaterial } from 't3d';
import { GroundShader } from './shader/GroundShader.js';

export class ViewerGround extends Mesh {

	constructor() {
		const material = new ShaderMaterial(GroundShader);
		material.acceptLight = true;
		material.uniforms.showGrid = true;
		material.metalness = 0;
		material.roughness = 1;
		material.transparent = true;
		material.polygonOffset = true;
		material.polygonOffsetFactor = 1;
		material.polygonOffsetUnits = 1;

		super(new PlaneGeometry(1, 1), material);

		this.receiveShadow = true;
	}

	fitSize(diagonal) {
		this.position.y = -Math.abs(diagonal.y / 2);

		const groundSize = Math.max(30, Math.abs(Math.max(diagonal.x, diagonal.z) * 2));
		this.scale.set(groundSize, 1, groundSize);

		let size = Math.abs(Math.max(diagonal.x, diagonal.z) * 2);
		size = Math.max(30, size);
		this.material.uniforms.size = size / 2;
		this.material.uniforms.gridSize = size / 10;
		this.material.uniforms.gridSize2 = size / 50;
	}

	setStyle(options) {
		this.visible = options.show;
		this.material.uniforms.color = [parseInt(options.color.charAt(1) + options.color.charAt(2), 16) / 255, parseInt(options.color.charAt(3) + options.color.charAt(4), 16) / 255, parseInt(options.color.charAt(5) + options.color.charAt(6), 16) / 255, 1];
		this.material.uniforms.showGrid = options.grid;
	}

}