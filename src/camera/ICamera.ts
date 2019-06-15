import * as THREE from "three";

export default interface ICamera {
	readonly camera: THREE.Camera;
	readonly zoom: number;

	dispose(): void;
	setPosition(vector: THREE.Vector3 | number, y?: number, z?: number): void;
	setZoom(zoom: number): void;
}
