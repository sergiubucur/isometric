import * as THREE from "three";

export default interface IScene {
	readonly scene: THREE.Scene;
	readonly map: any;
	readonly mapSize: number;

	init(): Promise<void>;
	update(): void;
	convertToMapPosition(position: THREE.Vector3, round?: boolean): THREE.Vector3;
}
