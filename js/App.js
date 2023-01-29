import { Viewer } from "./Viewer.js";
import { Options } from "./config.js";
import { AddGUI } from "./Control.js";
import { updateGui } from "./updateGui.js";
import { ValidationController } from "./ValidationController.js";
import { SimpleDropzone } from "simple-dropzone";

export class App {

	constructor(el) {
		this.el = el;
		this.viewer = null;
		this.gui = null;
		this.viewerEl = null;

		this.filename = null;

		this.dropEl = document.querySelector(".dropzone");
		this.inputEl = document.querySelector("#file-input");
		this.spinnerEl = el.querySelector(".spinner");
		this.validationCtrl = new ValidationController(el);

		this.createDropzone();
		this.createPreModel();
		this.hideSpinner();
	}

	createDropzone() {
		const dropCtrl = new SimpleDropzone(this.dropEl, this.inputEl);
		dropCtrl.on("drop", ({ files }) => this.load(files));
		dropCtrl.on("dropstart", () => this.showSpinner());
		dropCtrl.on("droperror", () => this.hideSpinner());
	}

	createPreModel() {
		const model1 = document.querySelector("#model-dog");
		const model2 = document.querySelector("#model-helmet");
		const model3 = document.querySelector("#model-room");
		const _this = this;
		model1.onclick = function() {
			_this.showSpinner();
			_this.view("./models/robotPBR/robot.gltf");
		};
		model2.onclick = function() {
			_this.showSpinner();
			_this.view("./models/UinoHelmet/glTF/UinoHelmet.gltf");
		};
		model3.onclick = function() {
			_this.showSpinner();
			_this.view("./models/Room.glb");
		};
	}

	load(fileMap) {
		let rootFile;
		let rootPath;
		Array.from(fileMap).forEach(([path, file]) => {
			if (file.name.match(/\.(gltf|glb)$/)) {
				rootFile = file;
				rootPath = path.replace(file.name, "");
			}
			this.filename = file.name;
		});

		if (!rootFile) {
			this.onError("No .gltf or .glb asset found.");
		}

		this.view(rootFile, rootPath, fileMap);
	}

	createViewer() {
		this.viewerEl = document.createElement("div");
		this.viewerEl.classList.add("viewer");
		this.dropEl.innerHTML = "";
		this.dropEl.appendChild(this.viewerEl);
		this.viewer = new Viewer(this.viewerEl);
		this.viewer.startRender();
		return this.viewer;
	}

	importFileJSON() {
		var inputObj = document.createElement('input');

		inputObj.setAttribute('id', '_ef');

		inputObj.setAttribute('type', 'file');

		inputObj.setAttribute("style", 'visibility:hidden;height:0px');

		document.body.appendChild(inputObj);

		inputObj.click();

		inputObj.onchange = (event) => {
			this.readFileJSON(event)
				.then((res) => {
					console.log("import data:", res);
					updateGui(this.gui.gui, res);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		document.body.removeChild(inputObj);
	}

	exportFileJSON(data) {
		if (typeof data === "object") {
			data = JSON.stringify(data, null, 4);
		}
		const blob = new Blob([data], { type: "text/json" }),
			e = new MouseEvent("click"),
			a = document.createElement("a");

		a.download = "example.json";
		a.href = window.URL.createObjectURL(blob);
		a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
		a.dispatchEvent(e);
	}

	readFileJSON(ev) {
		return new Promise((resolve, reject) => {
			const fileDom = ev.target,
				file = fileDom.files[0];

			if (file.type !== "application/json") {
				reject("Only supports uploading json file.");
			}

			if (typeof FileReader === "undefined") {
				reject("FileReader not support.");
			}

			ev.target.value = "";

			const reader = new FileReader();
			reader.readAsText(file);

			reader.onerror = (err) => {
				reject("Data parsing failed(1).", err);
			};

			reader.onload = () => {
				const resultData = reader.result;
				if (resultData) {
					try {
						const importData = JSON.parse(resultData);
						resolve(importData);
					} catch (error) {
						reject("Data parsing failed(2).", error);
					}
				} else {
					reject("Data parsing failed(3)", error);
				}
			};
		});
	}

	view(rootFile, rootPath, fileMap) {
		if (this.viewer) this.viewer.clear();

		const viewer = this.viewer || this.createViewer();
		this.options = new Options(viewer);

		const fileURL = typeof rootFile === "string" ? rootFile : URL.createObjectURL(rootFile);

		const cleanup = () => {
			this.hideSpinner();
			if (typeof rootFile === "object") URL.revokeObjectURL(fileURL);
		};

		viewer
			.load(fileURL, rootPath, fileMap)
			.catch((e) => this.onError(e))
			.then((gltf) => {
				const gui = this.gui || new AddGUI(viewer, this.options, this);
				this.gui = gui;
				gltf.animations ? this.gui.setAnimationFolder(gltf.animations) : (this.gui.animationFolder.domElement.style.display = "none");
				this.validationCtrl.validate(gltf.data, fileURL, rootPath, fileMap, this.viewer, gltf);
				cleanup();
			});
	}

	onError(error) {
		let message = (error || {}).message || error.toString();
		if (message.match(/ProgressEvent/)) {
			message =
        "Unable to retrieve this file. Check JS console and browser network tab.";
		} else if (message.match(/Unexpected token/)) {
			message = `Unable to parse file content. Verify that this file is valid. Error: "${message}"`;
		} else if (error && error.target && error.target instanceof Image) {
			error = "Missing texture: " + error.target.src.split("/").pop();
		}
		window.alert(message);
		console.error(error);
	}

	showSpinner() {
		this.spinnerEl.style.display = "";
	}

	hideSpinner() {
		this.spinnerEl.style.display = "none";
	}

}

document.addEventListener("DOMContentLoaded", () => {
	new App(document.body, location);
});
