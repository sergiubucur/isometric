import * as THREE from "three";

export default interface ILogger {
	dispose(): void;
	update(): void;
	log(message: string): void;
	logNumber(name: string, number: number, digits?: number): void;
	logVector3(name: string, vector3: THREE.Vector3, digits?: number): void;
	logBounds(name: string, number: number, digits?: number): void;
}
