import * as THREE from "three";

export default interface IScene {
	readonly scene: THREE.Scene;

	init(): Promise<void>;
	update(): void;
}
