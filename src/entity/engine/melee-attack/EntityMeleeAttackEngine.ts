import * as THREE from "three";

import IEntityMeleeAttackEngine from "./IEntityMeleeAttackEngine";
import IEntityMovementEngine from "../movement/IEntityMovementEngine";

const AttackAnimationTotalFrames = 30;
const HalfTime = Math.floor(AttackAnimationTotalFrames / 2);

export default class EntityMeleeAttackEngine implements IEntityMeleeAttackEngine {
	onHit: () => void;

	private _getTargetPosition: () => THREE.Vector3;
	private _getTargetSize: () => number;
	private _mesh: THREE.Mesh;
	private _movementEngine: IEntityMovementEngine;
	private _size: number;
	private _originalPosition: THREE.Vector3;
	private _animationFrames: number;
	private _offset: THREE.Vector3;
	private _direction: THREE.Vector3;

	constructor() {
		this.onHit = () => {};

		this._originalPosition = new THREE.Vector3();
		this._animationFrames = 0;
		this._offset = new THREE.Vector3();
		this._direction = new THREE.Vector3();
	}

	init(getTargetPosition: () => THREE.Vector3, getTargetSize: () => number, mesh: THREE.Mesh,
		movementEngine: IEntityMovementEngine, size: number) {

		this._getTargetPosition = getTargetPosition;
		this._getTargetSize = getTargetSize;
		this._mesh = mesh;
		this._movementEngine = movementEngine;
		this._size = size;
	}

	isAttacking() {
		return this._animationFrames > 0;
	}

	performAttack() {
		this._animationFrames--;

		this._movementEngine.startMovingTo(this._getTargetPosition());
		this._direction.copy(this._movementEngine.velocity).normalize();
		this._mesh.rotation.y = this._movementEngine.rotationY;

		const value = this._animationFrames / AttackAnimationTotalFrames;
		this._offset.x = Math.sin(Math.PI * value) * this._direction.x;
		this._offset.y = Math.sin(Math.PI * value) * this._size;
		this._offset.z = Math.sin(Math.PI * value) * this._direction.z;
		this._mesh.position.copy(this._originalPosition).add(this._offset);

		if (this._animationFrames === HalfTime) {
			if (this.canAttack()) {
				this.onHit();
			}
		}
	}

	canAttack() {
		const meleeRange = (this._size / 2 + this._getTargetSize() / 2) * 2;

		return this._movementEngine.position.distanceTo(this._getTargetPosition()) <= meleeRange;
	}

	startAttacking() {
		this._originalPosition.copy(this._movementEngine.position);
		this._animationFrames = AttackAnimationTotalFrames;
	}
}
