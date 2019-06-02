import * as THREE from "three";

import IRenderer from "./IRenderer";
import IDisposable from "../common/IDisposable";

export default class Renderer implements IRenderer, IDisposable {
	private _renderer: THREE.WebGLRenderer;
	private _halfSizeRendering: boolean;
	private _antiAliasing: boolean;

	constructor() {
		this._halfSizeRendering = false;
		this._antiAliasing = true;

		this.init();
	}

	dispose() {
		document.body.removeChild(this._renderer.domElement);
	}

	render(scene: THREE.Scene, camera: THREE.Camera): void {
		this._renderer.render(scene, camera);
	}

	private init() {
		let width = window.innerWidth;
		let height = window.innerHeight;

		if (this._halfSizeRendering) {
			width /= 2;
			height /= 2;
		}

		this._renderer = new THREE.WebGLRenderer({ antialias: this._antiAliasing });
		this._renderer.setSize(width, height);

		document.body.appendChild(this._renderer.domElement);

		if (this._halfSizeRendering) {
			this._renderer.domElement.style.width = width * 2 + "px";
			this._renderer.domElement.style.height = height * 2 + "px";
		}
	}
}
