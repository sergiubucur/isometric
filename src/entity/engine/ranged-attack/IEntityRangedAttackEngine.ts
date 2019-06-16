import * as THREE from "three";

import IEntityMovementEngine from "../movement/IEntityMovementEngine";
import IEntityAttackEngine from "../IEntityAttackEngine";

export default interface IEntityRangedAttackEngine extends IEntityAttackEngine {
	init(getTargetPosition: () => THREE.Vector3, mesh: THREE.Mesh, movementEngine: IEntityMovementEngine, size: number, range: number): void;
}
