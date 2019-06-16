import * as THREE from "three";

import IEntityMovementEngine from "../movement/IEntityMovementEngine";
import IEntityAttackEngine from "../IEntityAttackEngine";

export default interface IEntityMeleeAttackEngine extends IEntityAttackEngine {
	init(getTargetPosition: () => THREE.Vector3, getTargetSize: () => number, mesh: THREE.Mesh,
		movementEngine: IEntityMovementEngine, size: number): void;
}
