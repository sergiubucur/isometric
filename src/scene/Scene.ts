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

			const geometry = new THREE.BoxGeometry();

			// 0 0 - red
			const material1 = new THREE.MeshPhongMaterial();
			material1.color.setRGB(1, 0, 0);
			const mesh1 = new THREE.Mesh(geometry, material1);
			mesh1.position.set(0, 0, 0);
			this.scene.add(mesh1);

			// X - green
			const material2 = new THREE.MeshPhongMaterial();
			material2.color.setRGB(0, 1, 0);
			const mesh2 = new THREE.Mesh(geometry, material2);
			mesh2.position.set(1.25, 0, 0);
			this.scene.add(mesh2);

			// Z - blue
			const material3 = new THREE.MeshPhongMaterial();
			material3.color.setRGB(0, 0, 1);
			const mesh3 = new THREE.Mesh(geometry, material3);
			mesh3.position.set(0, 0, 1.25);
			this.scene.add(mesh3);

			// Y - pink
			const material4 = new THREE.MeshPhongMaterial();
			material4.color.setRGB(1, 0, 1);
			const mesh4 = new THREE.Mesh(geometry, material4);
			mesh4.position.set(0, 1.25, 0);
			this.scene.add(mesh4);

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

		const dirLight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1));
		dirLight.position.set(-0.25, 0.5, -0.75).normalize();
		this.scene.add(dirLight);
	}
}
