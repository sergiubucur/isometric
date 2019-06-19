import Stats from "stats.js";

import IFpsDisplay from "./IFpsDisplay";

export default class FpsDisplay implements IFpsDisplay {
	private _stats: Stats;

	constructor() {
		this._stats = new Stats();
		this._stats.dom.style.cssText = `
			position: fixed;
			top: 306px;
			right: 30px;
			cursor: pointer;
			opacity: 0.75;
			z-index: 10000;
		`;
		this._stats.showPanel(0);

		document.body.appendChild(this._stats.dom);
	}

	beginFrame() {
		this._stats.begin();
	}

	endFrame() {
		this._stats.end();
	}

	hide() {
		this._stats.dom.style.display = "none";
	}

	show() {
		this._stats.dom.style.display = "block";
	}
}
