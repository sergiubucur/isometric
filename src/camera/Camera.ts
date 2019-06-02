import * as THREE from "three";

import ICamera from "./ICamera";

export default class Camera implements ICamera {
	readonly camera: THREE.Camera;
	private distanceFromTarget: number;

	constructor() {
		this.distanceFromTarget = 10;

		const aspect = window.innerWidth / window.innerHeight;
		const d = this.distanceFromTarget;

		this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
		this.camera.position.set(-d, d, d);
		this.camera.lookAt(0, 0, 0);
	}

	setPosition(v: THREE.Vector3 | number, y?: number, z?: number) {
		const d = this.distanceFromTarget;

		if (v instanceof THREE.Vector3) {
			this.camera.position.set(-d + v.x, d + v.y, d + v.z);
		} else {
			this.camera.position.set(-d + v, d + y, d + z);
		}
	}
}
