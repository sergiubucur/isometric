import * as THREE from "three";

export default interface ILogger {
	update(): void;
	clear(): void;
	log(message: string): void;
	logNumber(name: string, value: number, digits?: number): void;
	logVector2(name: string, vector2: THREE.Vector2, digits?: number): void;
	logVector3(name: string, vector3: THREE.Vector3, digits?: number): void;
	logBounds(name: string, value: number, digits?: number): void;
}
