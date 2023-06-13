import { Viewer } from "./Viewer.js";
import { UIControl } from "./UIControl.js";
import { Validator } from "./Validator.js";
import { SimpleDropzone } from "simple-dropzone";
import modelList from "./configs/models.json";

export class App {

	constructor(el) {
		this.el = el;

		this.viewerEl = null;
		this.viewer = null;
		this.uiCtrl = null;
		this.validator = new Validator(el);

		this.dropEl = document.querySelector(".dropzone");
		this.inputEl = document.querySelector("#file-input");
		this.spinnerEl = el.querySelector(".spinner");

		// create dropzone
		const dropzone = new SimpleDropzone(this.dropEl, this.inputEl);
		dropzone.on("drop", ({ files }) => this.load(files));
		dropzone.on("dropstart", () => this.showSpinner());
		dropzone.on("droperror", () => this.hideSpinner());

		// prepare built-in models
		for (const { name, uri } of modelList.array) {
			document.querySelector(`#model-${name}`).onclick = () => {
				this.showSpinner();
				this.view(`./models/${uri}`);
			}
		}

		this.hideSpinner();
	}

	showSpinner() {
		this.spinnerEl.style.display = "";
	}

	hideSpinner() {
		this.spinnerEl.style.display = "none";
	}

	load(fileMap) {
		let rootFile;
		let rootPath;
		Array.from(fileMap).forEach(([path, file]) => {
			if (file.name.match(/\.(gltf|glb)$/)) {
				rootFile = file;
				rootPath = path.replace(file.name, "");
			}
		});

		if (!rootFile) {
			onError("No .gltf or .glb asset found.");
		}

		this.view(rootFile, rootPath, fileMap);
	}

	view(rootFile, rootPath, fileMap) {
		if (!this.viewer) {
			this.viewerEl = document.createElement("div");
			this.viewerEl.classList.add("viewer");
			this.dropEl.innerHTML = "";
			this.dropEl.appendChild(this.viewerEl);
			this.viewer = new Viewer(this.viewerEl);
			this.viewer.startRender();
		}

		this.viewer.clear();

		const fileURL = typeof rootFile === "string" ? rootFile : URL.createObjectURL(rootFile);

		this.viewer
			.load(fileURL, rootPath, fileMap)
			.catch(e => onError(e))
			.then(gltf => {
				this.uiCtrl = this.uiCtrl || new UIControl(this.viewer);
				this.uiCtrl.updateUIByModelBounds(this.viewer._boundingSphere.radius);
				this.uiCtrl.setAnimations(gltf.animations);
				this.validator.validate(gltf.data, fileURL, rootPath, fileMap, gltf);
				this.hideSpinner();
				if (typeof rootFile === "object") URL.revokeObjectURL(fileURL);
			});
	}

}

function onError(error) {
	let message = (error || {}).message || error.toString();
	if (message.match(/ProgressEvent/)) {
		message = "Unable to retrieve this file. Check JS console and browser network tab.";
	} else if (message.match(/Unexpected token/)) {
		message = `Unable to parse file content. Verify that this file is valid. Error: "${message}"`;
	} else if (error && error.target && error.target instanceof Image) {
		error = "Missing texture: " + error.target.src.split("/").pop();
	}
	window.alert(message);
	console.error(error);
}

document.addEventListener("DOMContentLoaded", () => {
	new App(document.body, location);
});
