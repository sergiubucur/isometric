import * as THREE from "three";

import IScene from "./IScene";

export default class Scene implements IScene {
	readonly scene: THREE.Scene;
	private _mesh: THREE.Mesh | null;

	constructor() {
		this.scene = new THREE.Scene();
		this._mesh = null;
	}

	init(): Promise<void> {
		return new Promise((resolve) => {
			const geometry = new THREE.BoxGeometry();
			const material = new THREE.MeshNormalMaterial();
			this._mesh = new THREE.Mesh(geometry, material);

			this.scene.add(this._mesh);

			setTimeout(() => {
				resolve();
			});
		});
	}

	update(): void {
		this._mesh.rotation.y += 0.01;
	}
}
