import { Viewer } from './Viewer.js';
import { UIControl } from './UIControl.js';
import { Validator } from './Validator.js';
import { SimpleDropzone } from 'simple-dropzone';
import modelList from './configs/models.json';

export class App {

	constructor(el) {
		this.el = el;

		this.viewerEl = null;
		this.viewer = null;
		this.uiCtrl = null;
		this.validator = new Validator(el);

		this.dropEl = document.querySelector('.dropzone');
		this.inputEl = document.querySelector('#file-input');
		this.spinnerEl = el.querySelector('.spinner');
		this.headerEl = document.querySelector('.header');

		const dropzone = new SimpleDropzone(this.dropEl, this.inputEl);
		dropzone.on('drop', ({ files }) => {
			let root = findRoot(files, /\.(gltf|glb)$/);

			if (root) {
				this.view(root.file, root.path, files);
			} else {
				if (this.viewer) {
					if (root = findRoot(files, /\.json/)) { // eslint-disable-line no-cond-assign
						this.viewConfig(root.file, root.path, files);
					} else if (root = findRoot(files, /\.(hdr|exr)$/)) { // eslint-disable-line no-cond-assign
						const fileURL = typeof root.file === 'string' ? root.file : URL.createObjectURL(root.file);
						const isEXR = root.file.name && root.file.name.endsWith && root.file.name.endsWith('.exr');
						this.viewer.setEnvironmentTextureByURL(fileURL, isEXR)
							.catch(e => onError(e))
							.finally(() => {
								this.hideSpinner();
							});
					} else {
						onError('No usable asset found.');
						this.hideSpinner();
					}
				} else {
					onError('Need to load the model first, but no .gltf or .glb asset found.');
					this.hideSpinner();
				}
			}
		});
		dropzone.on('dropstart', () => this.showSpinner());
		dropzone.on('droperror', () => this.hideSpinner());

		this.hideSpinner();

		// Prepare built-in models
		for (const { name, uri } of modelList.array) {
			document.querySelector(`#model-${name}`).onclick = () => {
				this.showSpinner();
				this.view(`./models/${uri}`);
			};
		}

		// Press F8 to toggle UI
		document.addEventListener('keydown', e => {
			if (e.key === 'F8' && this.uiCtrl !== null) {
				this.headerEl.style.display = this.headerEl.style.display === 'none' ? '' : 'none';
				this.uiCtrl.toggleHidden();
				this.viewer.resize();
			}
		});

		// Resize viewer on window resize
		window.addEventListener('resize', () => {
			this.viewer && this.viewer.resize();
		}, true);
	}

	showSpinner() {
		this.spinnerEl.style.display = '';
	}

	hideSpinner() {
		this.spinnerEl.style.display = 'none';
	}

	view(rootFile, rootPath, fileMap) {
		if (!this.viewer) {
			this.viewerEl = document.createElement('div');
			this.viewerEl.classList.add('viewer');
			this.dropEl.innerHTML = '';
			this.dropEl.appendChild(this.viewerEl);
			this.viewer = new Viewer(this.viewerEl);
			this.viewer.startRender();
		}

		this.viewer.clear();

		const fileURL = typeof rootFile === 'string' ? rootFile : URL.createObjectURL(rootFile);

		this.viewer
			.load(fileURL, rootPath, fileMap)
			.catch(e => onError(e))
			.then(gltf => {
				this.uiCtrl = this.uiCtrl || new UIControl(this.viewer);
				this.uiCtrl.updateUIByModelBounds(this.viewer._boundingSphere.radius);
				this.uiCtrl.setAnimations(gltf.animations);
				this.validator.validate(gltf.data, fileURL, rootPath, fileMap, gltf);
				this.hideSpinner();
				if (typeof rootFile === 'object') URL.revokeObjectURL(fileURL);
			});
	}

	viewConfig(rootFile, rootPath, fileMap) {
		if (rootFile.type !== 'application/json') {
			onError('Config file must be a JSON file.');
			return;
		}

		const reader = new FileReader();
		reader.onload = event => {
			const jsonData = JSON.parse(event.target.result);
			this.uiCtrl.importOptions(jsonData);
			this.hideSpinner();
		};
		reader.readAsText(rootFile);
	}

}

function onError(error) {
	let message = (error || {}).message || error.toString();
	if (message.match(/ProgressEvent/)) {
		message = 'Unable to retrieve this file. Check JS console and browser network tab.';
	} else if (message.match(/Unexpected token/)) {
		message = `Unable to parse file content. Verify that this file is valid. Error: "${message}"`;
	} else if (error && error.target && error.target instanceof Image) {
		error = 'Missing texture: ' + error.target.src.split('/').pop();
	}
	window.alert(message);
	console.error(error);
}

function findRoot(files, matcher) {
	let result;

	Array.from(files).forEach(([uri, file]) => {
		if (file.name.match(matcher)) {
			const path = uri.replace(file.name, '');
			result = { file, path };
		}
	});

	return result;
}

document.addEventListener('DOMContentLoaded', () => {
	new App(document.body, location);
});
