import { DRAW_SIDE, DepthMaterial, DistanceMaterial } from 't3d';

export function defaultGetDepthMaterialFn(renderable, light) {
	const useSkinning = !!renderable.object.skeleton;
	const useMorphing = renderable.geometry.morphAttributes.position && renderable.geometry.morphAttributes.position.length > 0;

	const clippingPlanes = renderable.material.clippingPlanes;
	const numClippingPlanes = (clippingPlanes && clippingPlanes.length > 0) ? clippingPlanes.length : 0;

	const index = useMorphing << 0 | useSkinning << 1;

	let materials = depthMaterials[index];

	if (materials === undefined) {
		materials = {};
		depthMaterials[index] = materials;
	}

	let material = materials[numClippingPlanes];

	if (material === undefined) {
		material = new DepthMaterial();
		material.packToRGBA = true;

		materials[numClippingPlanes] = material;
	}

	material.side = light.shadow.flipSide ? shadowSide[renderable.material.side] : renderable.material.side;
	material.clippingPlanes = renderable.material.clippingPlanes;
	material.drawMode = renderable.material.drawMode;

	return material;
}

export function defaultGetDistanceMaterialFn(renderable, light) {
	const useSkinning = !!renderable.object.skeleton;
	const useMorphing = renderable.geometry.morphAttributes.position && renderable.geometry.morphAttributes.position.length > 0;

	const clippingPlanes = renderable.material.clippingPlanes;
	const numClippingPlanes = (clippingPlanes && clippingPlanes.length > 0) ? clippingPlanes.length : 0;

	const index = useMorphing << 0 | useSkinning << 1;

	let materials = distanceMaterials[index];

	if (materials === undefined) {
		materials = {};
		distanceMaterials[index] = materials;
	}

	let material = materials[numClippingPlanes];

	if (material === undefined) {
		material = new DistanceMaterial();

		materials[numClippingPlanes] = material;
	}

	material.side = light.shadow.flipSide ? shadowSide[renderable.material.side] : renderable.material.side;
	material.uniforms['nearDistance'] = light.shadow.cameraNear;
	material.uniforms['farDistance'] = light.shadow.cameraFar;

	material.clippingPlanes = renderable.material.clippingPlanes;
	material.drawMode = renderable.material.drawMode;

	return material;
}

const depthMaterials = {};
const distanceMaterials = {};

const shadowSide = { 'front': DRAW_SIDE.BACK, 'back': DRAW_SIDE.FRONT, 'double': DRAW_SIDE.DOUBLE };