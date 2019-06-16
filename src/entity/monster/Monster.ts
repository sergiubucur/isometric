import * as THREE from "three";

import IMonster from "./IMonster";
import IWorld from "../../world/IWorld";
import IPlayer from "../player/IPlayer";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../movement-engine/IEntityMovementEngine";
import IAssetService from "../../asset/IAssetService";
import IEntityMeleeAttackEngine from "../melee-attack-engine/IEntityMeleeAttackEngine";
import IPrimitiveCache from "../../world/primitive-cache/IPrimitiveCache";

const Size = 2;
const Speed = 0.1;
const Color = 0xff0000;
const DeathAnimationTotalFrames = 30;
const ScatterTotalFrames = 60;
const ScatterRange = 10;
const MeshName = "human";
const MaterialCacheKey = "Monster";

export default class Monster implements IMonster {
	id: number;
	dead: boolean;
	readonly size: number;

	private _mesh: THREE.Mesh;
	private _deathAnimationFrames: number;
	private _scatterFrames: number;
	private _material: THREE.MeshPhongMaterial;

	constructor(private _world: IWorld, private _player: IPlayer, private _entityId: IEntityId,
		private _movementEngine: IEntityMovementEngine, private _assetService: IAssetService,
		private _meleeAttackEngine: IEntityMeleeAttackEngine, private _primitiveCache: IPrimitiveCache) {

		this.id = this._entityId.getNewId();
		this.dead = false;
		this.size = Size;
		this._deathAnimationFrames = DeathAnimationTotalFrames;
		this._scatterFrames = 0;
		this._material = this._primitiveCache.getMaterial(MaterialCacheKey, () => new THREE.MeshPhongMaterial({ color: Color }));
	}

	init(position: THREE.Vector3) {
		this._movementEngine.init(this.id, position, Size, Speed);
		this._movementEngine.afterPositionUpdate = () => {
			this.updateMeshPosition();
		};

		this.initMesh();

		this._meleeAttackEngine.init(() => this._player.position, () => this._player.size, this._mesh, this._movementEngine, this.size);
		this._meleeAttackEngine.onHit = () => {
			this._player.damage();
		};
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

		if (this._meleeAttackEngine.isAttacking()) {
			this._meleeAttackEngine.performAttack();
		} else {
			if (!this._player.dead && this._meleeAttackEngine.canAttack()) {
				this._meleeAttackEngine.startAttacking();
			} else {
				if (this._scatterFrames > 0) {
					this._scatterFrames--;
				} else {
					this.chase();

					if (Math.random() < 0.01) {
						this.scatter();
					}
				}

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

	private chase() {
		if (!this._player.dead && !this._player.invisible) {
			this._movementEngine.startMovingTo(this._player.position);
		}
	}

	private scatter() {
		const position = this._movementEngine.position.clone();
		position.x += Math.random() * ScatterRange * 2 - ScatterRange;
		position.z += Math.random() * ScatterRange * 2 - ScatterRange;

		this._movementEngine.startMovingTo(position);
		this._scatterFrames = ScatterTotalFrames;
	}

	private initMesh() {
		const geometry = (this._assetService.assets[MeshName].content as THREE.Mesh).geometry;

		this._mesh = new THREE.Mesh(geometry, this._material);
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
