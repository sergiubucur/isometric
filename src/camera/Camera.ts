import * as THREE from "three";

import ICamera from "./ICamera";

const NearPlane = 0.1;
const FarPlane = 1000;
const FieldOfView = 30;
const MaxZoom = 32;
const MinZoom = 12;

export default class Camera implements ICamera {
	private _camera: THREE.PerspectiveCamera;
	get camera(): THREE.Camera {
		return this._camera;
	}

	private _position: THREE.Vector3;
	zoom: number;

	constructor() {
		this.zoom = MaxZoom;
		this._position = new THREE.Vector3(0, 0, 0);

		this._camera = new THREE.PerspectiveCamera(FieldOfView, window.innerWidth / window.innerHeight, NearPlane, FarPlane);
		this._camera.position.set(-this.zoom, this.zoom, this.zoom);
		this._camera.lookAt(0, 0, 0);
	}

	setPosition(v: THREE.Vector3 | number, y?: number, z?: number) {
		if (v instanceof THREE.Vector3) {
			this._camera.position.set(-this.zoom + v.x, this.zoom + v.y, this.zoom + v.z);
			this._position.copy(v);
		} else {
			this._camera.position.set(-this.zoom + v, this.zoom + y, this.zoom + z);
			this._position.set(v, y, z);
		}
	}

	setZoom(value: number) {
		this.zoom = THREE.Math.clamp(value, MinZoom, MaxZoom);
		this.setPosition(this._position);
	}
}
