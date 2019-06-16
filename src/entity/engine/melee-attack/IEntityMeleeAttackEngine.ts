import * as THREE from "three";

import IEntityMovementEngine from "../movement/IEntityMovementEngine";

export default interface IEntityMeleeAttackEngine {
	onHit: () => void;

	init(getTargetPosition: () => THREE.Vector3, getTargetSize: () => number, mesh: THREE.Mesh,
		movementEngine: IEntityMovementEngine, size: number): void;

	isAttacking(): boolean;
	performAttack(): void;
	canAttack(): boolean;
	startAttacking(): void;
}
