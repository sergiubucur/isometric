import * as THREE from "three";

export default interface IRenderer {
	render(scene: THREE.Scene, camera: THREE.Camera): void;
}
