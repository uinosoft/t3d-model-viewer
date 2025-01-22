import { Box3, Vector3 } from 't3d';

export class ModelBounds {

	constructor() {
		this.box = new Box3();
		this.center = new Vector3();
		this.diagonal = new Vector3();
		this.diameter = 0;

		this.rootBones = [];
	}

	makeEmpty() {
		this.box.makeEmpty();
		this.center.set(0, 0, 0);
		this.diagonal.set(0, 0, 0);
		this.diameter = 0;
	}

	computeBounds(root) {
		getBoundingBox(root, this.rootBones, this.box);
		this.box.getCenter(this.center);
		this.box.getSize(this.diagonal);
		this.diameter = this.diagonal.getLength();
	}

	move(offset) {
		this.box.min.add(offset);
		this.box.max.add(offset);
		this.box.getCenter(this.center);
	}

	collectRootBones(node) {
		const { rootBones } = this;
		if (!rootBones.includes(node) && node.isBone && !node.parent.isBone) {
			rootBones.push(node);
		}
	}

	clearRootBones() {
		this.rootBones.length = 0;
	}

}

const _childBox = new Box3();
const _pos = new Vector3();

function getBoundingBox(object, rootBones, target) {
	_pos.set(0, 0, 0);
	_childBox.makeEmpty();
	target.makeEmpty();
	object.updateMatrix();

	object.traverse(node => {
		if (node.geometry) {
			if (node.isSkinnedMesh) {
				node.geometry.computeBoundingBox();
				_childBox.copy(node.geometry.boundingBox);
				rootBones.forEach(rootbone => {
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