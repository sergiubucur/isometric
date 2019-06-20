import * as THREE from "three";

export default interface IRenderer {
	readonly info: THREE.WebGLInfo;

	render(scene: THREE.Scene, camera: THREE.Camera): void;
	dispose(): void;
}
