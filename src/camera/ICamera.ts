import * as THREE from "three";

export default interface ICamera {
	readonly camera: THREE.Camera;

	setPosition(vector: THREE.Vector3 | number, y?: number, z?: number): void;
}
