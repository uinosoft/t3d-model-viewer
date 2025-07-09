import { GLTFLoader } from 't3d/addons/loaders/glTF/GLTFLoader.js';
import { DRACOLoader } from 't3d/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 't3d/addons/loaders/KTX2Loader.js';
import { GLTFUtils } from 't3d/addons/loaders/glTF/GLTFUtils.js';
import { EXT_mesh_gpu_instancing } from 't3d/addons/loaders/glTF/extensions/EXT_mesh_gpu_instancing.js';
import { KHR_materials_transmission } from 't3d/addons/loaders/glTF/extensions/KHR_materials_transmission.js';
import { KHR_materials_ior } from 't3d/addons/loaders/glTF/extensions/KHR_materials_ior.js';
import { KHR_materials_volume } from 't3d/addons/loaders/glTF/extensions/KHR_materials_volume.js';
import { KHR_materials_dispersion } from 't3d/addons/loaders/glTF/extensions/KHR_materials_dispersion.js';
import { MeshoptDecoder } from '../libs/meshopt_decoder.module.js';
import * as KTXParse from '../libs/ktx-parse.module.js';
import { ZSTDDecoder } from '../libs/zstddec.module.js';

export class GLTFModelLoader extends GLTFLoader {

	constructor(manager, renderer) {
		super(manager);

		// some material extensions are mutually exclusive,
		// so we move the more important ones to the front.
		this.autoParseConfig = {
			materials: [
				'KHR_materials_unlit',
				'KHR_materials_transmission',
				'KHR_materials_ior',
				'KHR_materials_volume',
				'KHR_materials_dispersion',
				'KHR_materials_clearcoat',
				'KHR_materials_pbrSpecularGlossiness'
			]
		};

		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('./libs/draco/');

		const zstdDecoder = new ZSTDDecoder().init();
		KTX2Loader.setKTXParser(KTXParse).setZSTDDecoder(zstdDecoder);
		const ktx2Loader = new KTX2Loader()
			.setTranscoderPath('./libs/basis/')
			.detectSupport(renderer);

		this.replaceParser(IndexParser, 0);
		this.extensions.set('EXT_mesh_gpu_instancing', EXT_mesh_gpu_instancing);
		this.extensions.set('KHR_materials_transmission', KHR_materials_transmission);
		this.extensions.set('KHR_materials_ior', KHR_materials_ior);
		this.extensions.set('KHR_materials_volume', KHR_materials_volume);
		this.extensions.set('KHR_materials_dispersion', KHR_materials_dispersion);
		this.setDRACOLoader(dracoLoader);
		this.setKTX2Loader(ktx2Loader);
		this.setMeshoptDecoder(MeshoptDecoder);
	}

}

class IndexParser {

	static parse(context, loader) {
		const { url } = context;

		return loader.loadFile(url, 'arraybuffer').then(data => {
			context.data = data;

			const magic = GLTFUtils.decodeText(new Uint8Array(data, 0, 4));

			if (magic === 'glTF') {
				const glbData = GLTFUtils.parseGLB(data);
				context.gltf = glbData.gltf;
				context.buffers = glbData.buffers;
			} else {
				const gltfString = GLTFUtils.decodeText(new Uint8Array(data));
				context.gltf = JSON.parse(gltfString);
			}
		});
	}

}