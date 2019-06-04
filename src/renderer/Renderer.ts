import * as THREE from "three";

import IRenderer from "./IRenderer";
import IDisposable from "../common/IDisposable";

const HalfSizeRendering = false;
const AntiAliasing = true;

export default class Renderer implements IRenderer, IDisposable {
	private _renderer: THREE.WebGLRenderer;

	constructor() {
		this.init();
	}

	dispose() {
		document.body.removeChild(this._renderer.domElement);
	}

	render(scene: THREE.Scene, camera: THREE.Camera) {
		this._renderer.render(scene, camera);
	}

	private init() {
		let width = window.innerWidth;
		let height = window.innerHeight;

		if (HalfSizeRendering) {
			width /= 2;
			height /= 2;
		}

		this._renderer = new THREE.WebGLRenderer({ antialias: AntiAliasing });
		this._renderer.setSize(width, height);

		document.body.appendChild(this._renderer.domElement);

		if (HalfSizeRendering) {
			this._renderer.domElement.style.width = width * 2 + "px";
			this._renderer.domElement.style.height = height * 2 + "px";
		}
	}
}
