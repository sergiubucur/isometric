import * as THREE from "three";

import ILogger from "./ILogger";

export default class Logger implements ILogger {
	private _domElement: HTMLElement;
	private _logItems: string[];
	private _bounds: { [key: string]: { min: number, max: number }};

	constructor() {
		this._logItems = [];
		this._bounds = {};

		this._domElement = document.createElement("div");
		this.initDomElement();
	}

	private initDomElement() {
		this._domElement.style.color = "#fff";
		this._domElement.style.fontFamily = "Arial, Helvetica, sans-serif";
		this._domElement.style.fontSize = "22px";
		this._domElement.style.position = "absolute";
		this._domElement.style.left = "10px";
		this._domElement.style.top = "10px";
		this._domElement.style.zIndex = "100";

		document.body.appendChild(this._domElement);
	}

	update() {
		this._domElement.innerHTML = this._logItems.join("<br/>");

		this._logItems.length = 0;
	}

	dispose() {
		document.body.removeChild(this._domElement);
	}

	log(message: string) {
		this._logItems.push(message);
	}

	logNumber(name: string, number: number, digits = 2) {
		this._logItems.push(`${name}: ${number.toFixed(digits)}`);
	}

	logVector3(name: string, vector3: THREE.Vector3, digits = 2) {
		this._logItems.push(`${name}: ${vector3.x.toFixed(digits)} ${vector3.y.toFixed(digits)} ${vector3.z.toFixed(digits)}`);
	}

	logBounds(name: string, number: number, digits = 2) {
		if (!this._bounds[name]) {
			this._bounds[name] = { min: Infinity, max: -Infinity };
		}

		const bounds = this._bounds[name];
		bounds.min = Math.min(number, bounds.min);
		bounds.max = Math.max(number, bounds.max);

		this._logItems.push(`${name}: ${number.toFixed(digits)} (min: ${bounds.min.toFixed(digits)}, max: ${bounds.max.toFixed(digits)})`);
	}
}
