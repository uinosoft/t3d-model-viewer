import { TEXEL_ENCODING_TYPE } from 't3d';
import defaultOptions from './configs/options.json';

function readFileJSON(ev) {
	return new Promise((resolve, reject) => {
		const fileDom = ev.target,
			file = fileDom.files[0];

		if (file.type !== 'application/json') {
			reject('Only supports uploading json file.');
		}

		if (typeof FileReader === 'undefined') {
			reject('FileReader not support.');
		}

		ev.target.value = '';

		const reader = new FileReader();
		reader.readAsText(file);

		reader.onerror = err => {
			reject('Data parsing failed(1).', err);
		};

		reader.onload = () => {
			const resultData = reader.result;
			if (resultData) {
				try {
					const importData = JSON.parse(resultData);
					resolve(importData);
				} catch (error) {
					reject('Data parsing failed(2).', error);
				}
			} else {
				reject('Data parsing failed(3)', {});
			}
		};
	});
}

export function exportFileJSON(data) {
	if (typeof data === 'object') {
		data = JSON.stringify(data, null, 4);
	}
	const blob = new Blob([data], { type: 'text/json' }),
		e = new MouseEvent('click'),
		a = document.createElement('a');

	a.download = 'config.json';
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
	a.dispatchEvent(e);
}

export function importFileJSON(callback) {
	const inputObj = document.createElement('input');
	inputObj.setAttribute('id', '_ef');
	inputObj.setAttribute('type', 'file');
	inputObj.setAttribute('style', 'visibility:hidden;height:0px');
	document.body.appendChild(inputObj);

	inputObj.click();

	inputObj.onchange = event => {
		readFileJSON(event)
			.then(res => {
				console.log('import data:', res);
				callback(res);
			})
			.catch(err => {
				console.log(err);
			});
	};

	document.body.removeChild(inputObj);
}

export function extractUrlBase(url) {
	const index = url.lastIndexOf('/');
	if (index === -1) return './';
	return url.substr(0, index + 1);
}

export function upgradeJson(json) {
	if (json.version !== defaultOptions.version) {
		console.warn(`Auto upgrade json data ${json.version} -> ${defaultOptions.version}`);

		JsonTools.defaults(json, defaultOptions);
		JsonTools.trim(json, defaultOptions);

		json.version = defaultOptions.version;
	}

	return json;
}

export function cloneJson(json) {
	return JsonTools.clone(json);
}

class JsonTools {

	static clone(source) {
		if (typeof source !== 'object' || source === null) {
			return source;
		}

		const result = {};
		for (const key in source) {
			result[key] = this.clone(source[key]);
		}

		return result;
	}

	static defaults(json, standardJson) {
		for (const key in standardJson) {
			const type = typeof standardJson[key];
			if (!json.hasOwnProperty(key) || type !== typeof json[key]) {
				if (type === 'object') {
					json[key] = this.clone(standardJson[key]);
				} else {
					json[key] = standardJson[key];
				}
			} else {
				if (type === 'object') {
					this.defaults(json[key], standardJson[key]);
				}
			}
		}
	}

	static trim(json, standardJson) {
		for (const key in json) {
			if (standardJson.hasOwnProperty(key)) {
				if (typeof json[key] === 'object' && typeof standardJson[key] === 'object') {
					this.trim(json[key], standardJson[key]);
				}
			} else {
				delete json[key];
			}
		}
	}

}

export const ColorSpaceType = {
	'SRGB': TEXEL_ENCODING_TYPE.SRGB,
	'Gamma': TEXEL_ENCODING_TYPE.GAMMA,
	'Linear': TEXEL_ENCODING_TYPE.LINEAR
};