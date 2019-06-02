import * as THREE from "three";

import ICamera from "./ICamera";

export default class Camera implements ICamera {
	readonly camera: THREE.Camera;

	constructor() {
		this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
		this.camera.position.set(2, 2, 2);
		this.camera.lookAt(0, 0, 0);
	}
}
