import * as THREE from "three";

import IScene from "./IScene";

export default class Scene implements IScene {
	readonly scene: THREE.Scene;

	constructor() {
		this.scene = new THREE.Scene();
	}

	init(): Promise<void> {
		return new Promise((resolve) => {
			this.initLights();

			const geometry = new THREE.BoxBufferGeometry(0.9, 0.9, 0.9);
			const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0.13, 0.16, 0.19) });

			const n = 32;

			for (let y = 0; y <= n; y++) {
				for (let x = 0; x <= n; x++) {
					const mesh = new THREE.Mesh(geometry, material);
					mesh.position.set(x, -0.5, y);
					this.scene.add(mesh);
				}
			}

			setTimeout(() => {
				resolve();
			});
		});
	}

	update() {
	}

	private initLights() {
		const ambLight = new THREE.AmbientLight(new THREE.Color(0.25, 0.25, 0.25));
		this.scene.add(ambLight);

		const dirLight = new THREE.DirectionalLight(new THREE.Color(1, 0.85, 0.7));
		dirLight.position.set(-0.25, 0.5, -0.75).normalize();
		this.scene.add(dirLight);
	}
}
