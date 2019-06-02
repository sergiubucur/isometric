import * as THREE from "three";

import ICamera from "./ICamera";

const NearPlane = 1;
const FarPlane = 4000;
const MaxZoom = 16;
const MinZoom = 4;

// TODO: fix clipping issue near the bottom of the screen at lower zoom levels

export default class Camera implements ICamera {
	private _camera: THREE.OrthographicCamera;
	get camera(): THREE.Camera {
		return this._camera;
	}

	private _position: THREE.Vector3;
	zoom: number;

	constructor() {
		this.zoom = 16;
		this._position = new THREE.Vector3(0, 0, 0);

		this._camera = this.getCamera();
	}

	setPosition(v: THREE.Vector3 | number, y?: number, z?: number) {
		const d = this.zoom;

		if (v instanceof THREE.Vector3) {
			this._camera.position.set(-d + v.x, d + v.y, d + v.z);
			this._position.copy(v);
		} else {
			this._camera.position.set(-d + v, d + y, d + z);
			this._position.set(v, y, z);
		}
	}

	setZoom(value: number) {
		this.zoom = THREE.Math.clamp(value, MinZoom, MaxZoom);
		this._camera = this.getCamera();
		this.setPosition(this._position);
	}

	private getCamera(): THREE.OrthographicCamera {
		const aspect = window.innerWidth / window.innerHeight;
		const d = this.zoom;

		const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, NearPlane, FarPlane);
		camera.position.set(-d, d, d);
		camera.lookAt(0, 0, 0);

		return camera;
	}
}
