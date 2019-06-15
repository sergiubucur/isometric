import * as THREE from "three";

import IMonster from "./IMonster";
import IWorld from "../../world/IWorld";
import IPlayer from "../player/IPlayer";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../movement/IEntityMovementEngine";
import IAssetService from "../../asset/IAssetService";

const Size = 2;
const Speed = 0.1;
const Color = 0xff0000;
const DeathAnimationTotalFrames = 30;
const MeleeAttackAnimationTotalFrames = 30;
const MeshName = "human";

export default class Monster implements IMonster {
	id: number;
	dead: boolean;
	readonly size: number;

	private _mesh: THREE.Mesh;
	private _deathAnimationFrames: number;
	private _meleeAttackOriginalPosition: THREE.Vector3;
	private _meleeAttackAnimationFrames: number;
	private _meleeAttackOffset: THREE.Vector3;
	private _meleeAttackDirection: THREE.Vector3;

	private static _material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: Color });

	constructor(private _world: IWorld, private _player: IPlayer, private _entityId: IEntityId,
		private _movementEngine: IEntityMovementEngine, private _assetService: IAssetService) {

		this.id = this._entityId.getNewId();
		this.dead = false;
		this.size = Size;
		this._deathAnimationFrames = DeathAnimationTotalFrames;
		this._meleeAttackOriginalPosition = new THREE.Vector3();
		this._meleeAttackAnimationFrames = 0;
		this._meleeAttackOffset = new THREE.Vector3();
		this._meleeAttackDirection = new THREE.Vector3();
	}

	init(position: THREE.Vector3) {
		this._movementEngine.init(this.id, position, Size, Speed);
		this._movementEngine.afterPositionUpdate = () => {
			this.updateMeshPosition();
		};

		this.initMesh();
	}

	update() {
		if (this.dead) {
			if (this._deathAnimationFrames > 0) {
				this._deathAnimationFrames--;

				const value = this._deathAnimationFrames / DeathAnimationTotalFrames;
				this._mesh.rotation.x = -(1 - value) * (Math.PI / 2);
				this._mesh.position.y = (Size / 4) + Math.sin(Math.PI * value) * Size;
			}

			return;
		}

		if (this._meleeAttackAnimationFrames > 0) {
			this._meleeAttackAnimationFrames--;

			this._movementEngine.startMovingTo(this._player.position);
			this._meleeAttackDirection.copy(this._movementEngine.velocity).normalize();
			this._mesh.rotation.y = this._movementEngine.rotationY;

			const value = this._meleeAttackAnimationFrames / MeleeAttackAnimationTotalFrames;
			this._meleeAttackOffset.x = Math.sin(Math.PI * value) * this._meleeAttackDirection.x;
			this._meleeAttackOffset.y = Math.sin(Math.PI * value) * Size;
			this._meleeAttackOffset.z = Math.sin(Math.PI * value) * this._meleeAttackDirection.z;
			this._mesh.position.copy(this._meleeAttackOriginalPosition).add(this._meleeAttackOffset);

			if (this._meleeAttackAnimationFrames === 0) {
				if (this.canMeleeAttack()) {
					console.log("melee hit");
				}
			}
		} else {
			if (this.canMeleeAttack()) {
				this._meleeAttackOriginalPosition.copy(this._movementEngine.position);
				this._meleeAttackAnimationFrames = MeleeAttackAnimationTotalFrames;
			} else {
				this.chase();
				this._movementEngine.move();
			}
		}
	}

	damage() {
		if (this.dead) {
			this.updateMeshPosition();
			return;
		}

		this.dead = true;
		this._movementEngine.clearCells();
	}

	private canMeleeAttack() {
		const meleeRange = (this.size / 2 + this._player.size / 2) * 2;

		return this._movementEngine.position.distanceTo(this._player.position) <= meleeRange;
	}

	private chase() {
		if (!this._player.invisible) {
			this._movementEngine.startMovingTo(this._player.position);
		}
	}

	private initMesh() {
		const geometry = (this._assetService.assets[MeshName].content as THREE.Mesh).geometry;

		this._mesh = new THREE.Mesh(geometry, Monster._material);
		this._mesh.scale.set(Size, Size, Size);
		this._mesh.rotation.order = "ZYX";

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
		this._mesh.rotation.y = this._movementEngine.rotationY;
	}
}
