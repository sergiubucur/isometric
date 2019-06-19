import * as THREE from "three";

import ILogger from "./ILogger";
import IInputTracker from "../../input-tracker/IInputTracker";
import Keybinds from "../../input-tracker/Keybinds";
import Version from "../../common/Version";

type BoundsInfo = {
	value: number,
	min: number,
	max: number,
	digits: number
};

export default class Logger implements ILogger {
	private _domElement: HTMLElement;
	private _logItems: string[];
	private _bounds: { [key: string]: BoundsInfo };
	private _visible: boolean;
	private _keyPressed: boolean;

	constructor(private _inputTracker: IInputTracker) {
		this._logItems = [];
		this._bounds = {};
		this._visible = Version === "dev-build";
		this._keyPressed = false;

		this.initDomElement();
	}

	private initDomElement() {
		this._domElement = document.createElement("div");

		this._domElement.style.color = "#fff";
		this._domElement.style.fontFamily = "Arial, Helvetica, sans-serif";
		this._domElement.style.fontSize = "16px";
		this._domElement.style.position = "fixed";
		this._domElement.style.left = "10px";
		this._domElement.style.top = "10px";
		this._domElement.style.zIndex = "100";
		this._domElement.style.opacity = "0.5";
		this._domElement.style.display = Version === "dev-build" ? "block" : "none";
		this._domElement.style.userSelect = "none";

		document.body.appendChild(this._domElement);
	}

	update() {
		if (Version !== "dev-build") {
			this._logItems.unshift(
				`isometric - build ${Version} - by Sergiu-Valentin Bucur`,
				`----`
			);
		}

		this._domElement.innerHTML = this._logItems.join(`<div style="margin-bottom: 5px"></div>`);
		this._logItems.length = 0;

		Object.keys(this._bounds).forEach(x => {
			const { value, min, max, digits } = this._bounds[x];

			this._logItems.push(`${x}: ${value.toFixed(digits)} (min: ${min.toFixed(digits)}, max: ${max.toFixed(digits)})`);
		});

		this.updateVisibility();
	}

	private updateVisibility() {
		if (!this._inputTracker.keysPressed[Keybinds.Backtick]) {
			this._keyPressed = false;
		}

		if (this._inputTracker.keysPressed[Keybinds.Backtick] && !this._keyPressed) {
			this.toggleVisibility();
			this._keyPressed = true;
		}
	}

	clear() {
		this._domElement.innerHTML = "";
		this._logItems.length = 0;
	}

	dispose() {
		document.body.removeChild(this._domElement);
	}

	log(message: string) {
		this._logItems.push(message);
	}

	logNumber(name: string, value: number, digits = 2) {
		this._logItems.push(`${name}: ${value.toFixed(digits)}`);
	}

	logVector2(name: string, vector2: THREE.Vector2, digits = 2) {
		this._logItems.push(`${name}: ${vector2.x.toFixed(digits)} ${vector2.y.toFixed(digits)}`);
	}

	logVector3(name: string, vector3: THREE.Vector3, digits = 2) {
		this._logItems.push(`${name}: ${vector3.x.toFixed(digits)} ${vector3.y.toFixed(digits)} ${vector3.z.toFixed(digits)}`);
	}

	logBounds(name: string, value: number, digits = 2) {
		if (!this._bounds[name]) {
			this._bounds[name] = { value: value, min: Infinity, max: -Infinity, digits };
		} else {
			this._bounds[name].value = value;
			this._bounds[name].digits = digits;
		}

		const bounds = this._bounds[name];
		bounds.min = Math.min(value, bounds.min);
		bounds.max = Math.max(value, bounds.max);
	}

	toggleVisibility() {
		this._visible = !this._visible;

		if (this._visible) {
			this._domElement.style.display = "block";
		} else {
			this._domElement.style.display = "none";
		}
	}
}
