import * as THREE from "three";

export default interface IEntityMovementEngine {
	afterPositionUpdate: () => void;
	readonly id: number;
	readonly position: THREE.Vector3;
	readonly velocity: THREE.Vector3;
	readonly size: number;
	readonly speed: number;
	readonly rotationY: number;

	init(id: number, position: THREE.Vector3, size: number, speed: number): void;
	setProjectileMode(value: boolean, projectileOriginId?: number, onHit?: () => void): void;
	move(): void;
	canMoveTo(position: THREE.Vector3): boolean;
	startMovingTo(position: THREE.Vector3): void;
	stop(): void;
	moveTo(position: THREE.Vector3): void;
	clearCells(): void;
}
