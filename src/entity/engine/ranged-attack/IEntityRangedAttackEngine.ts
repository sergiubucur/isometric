import * as THREE from "three";

import IEntityMovementEngine from "../movement/IEntityMovementEngine";
import IEntityAttackEngine from "../IEntityAttackEngine";

export default interface IEntityRangedAttackEngine extends IEntityAttackEngine {
	init(getTargetPosition: () => THREE.Vector3, canAttack: () => boolean, range: number,
		mesh: THREE.Mesh, movementEngine: IEntityMovementEngine): void;
}
