import * as THREE from "three";

import IMonster from "./IMonster";
import IWorld from "../../world/IWorld";
import IPlayer from "../player/IPlayer";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../engine/movement/IEntityMovementEngine";
import IAssetService from "../../asset/IAssetService";
import IEntityMeleeAttackEngine from "../engine/melee-attack/IEntityMeleeAttackEngine";
import IPrimitiveCache from "../../world/primitive-cache/IPrimitiveCache";
import IEntityDeathAnimationEngine from "../engine/death-animation/IEntityDeathAnimationEngine";
import IEntityRangedAttackEngine from "../engine/ranged-attack/IEntityRangedAttackEngine";
import IEntityAttackEngine from "../engine/IEntityAttackEngine";
import AuraType from "../aura/AuraType";
import PowerupType from "../powerup/PowerupType";

const Size = 2;
const MeleeSpeed = 0.1;
const RangedSpeed = 0.05;
const MeleeColor = 0xff0000;
const RangedColor = 0x0080ff;
const ScatterTotalFrames = 60;
const ScatterRange = 10;
const MeshName = "human";
const MeleeMaterialCacheKey = "MonsterMelee";
const RangedMaterialCacheKey = "MonsterRanged";
const ProjectileColor = 0x0080ff;
const ProjectileRange = 30;
const ProjectileSpeed = 0.33;

export default class Monster implements IMonster {
	readonly id: number;
	dead: boolean;
	readonly size: number;

	private _mesh: THREE.Mesh;
	private _scatterFrames: number;
	private _material: THREE.MeshPhongMaterial;
	private _attackEngine: IEntityAttackEngine;
	private _ranged: boolean;

	constructor(private _world: IWorld, private _player: IPlayer, private _entityId: IEntityId,
		private _movementEngine: IEntityMovementEngine, private _assetService: IAssetService,
		private _meleeAttackEngineFactory: () => IEntityMeleeAttackEngine, private _rangedAttackEngineFactory: () => IEntityRangedAttackEngine,
		private _primitiveCache: IPrimitiveCache, private _deathAnimationEngine: IEntityDeathAnimationEngine) {

		this.id = this._entityId.getNewId();
		this.dead = false;
		this.size = Size;
		this._ranged = Math.random() > 0.5;
		this._scatterFrames = 0;
		this._material = this._ranged ?
			this._primitiveCache.getMaterial(RangedMaterialCacheKey, () => new THREE.MeshPhongMaterial({ color: RangedColor })) :
			this._primitiveCache.getMaterial(MeleeMaterialCacheKey, () => new THREE.MeshPhongMaterial({ color: MeleeColor }));
	}

	init(position: THREE.Vector3) {
		this._movementEngine.init(this.id, position, Size, this._ranged ? RangedSpeed: MeleeSpeed);
		this._movementEngine.afterPositionUpdate = () => {
			this.updateMeshPosition();
		};

		this.initMesh();
		this.initAttackEngine();

		this._deathAnimationEngine.init(this._mesh, this.size);
	}

	private initAttackEngine() {
		if (this._ranged) {
			const rangedAttackEngine = this._rangedAttackEngineFactory();

			rangedAttackEngine.init(() => this._player.position, () => !this._player.auraEngine.hasAura(AuraType.Cloaked),
				ProjectileRange, this._mesh, this._movementEngine);

			rangedAttackEngine.onHit = () => {
				this.throwProjectile();
			};

			this._attackEngine = rangedAttackEngine;
			return;
		}

		const meleeAttackEngine = this._meleeAttackEngineFactory();
		meleeAttackEngine.init(() => this._player.position, () => this._player.size, this._mesh, this._movementEngine, this.size);
		meleeAttackEngine.onHit = () => {
			this._player.damage();
		};

		this._attackEngine = meleeAttackEngine;
	}

	update() {
		if (this.dead) {
			this._deathAnimationEngine.runAnimation();
			return;
		}

		this._attackEngine.update();

		if (this._attackEngine.isAttacking()) {
			this._attackEngine.performAttack();
		} else {
			if (!this._player.dead && this._attackEngine.canAttack()) {
				this._attackEngine.startAttacking();
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
			return;
		}

		this.dropPowerup();
		this._player.gainExperience();

		this.updateMeshPosition();
		this._deathAnimationEngine.startAnimation();
		this._movementEngine.clearCells();
		this._movementEngine.stop();
		this.dead = true;
	}

	private dropPowerup() {
		const powerupPosition = this._world.map.convertToMapPosition(this._movementEngine.position);
		this._world.addPowerup(powerupPosition, PowerupType.Energy);
	}

	private throwProjectile() {
		this._world.addProjectile({
			startPosition: this._movementEngine.position,
			targetPosition: this._player.position,
			speed: ProjectileSpeed,
			color: new THREE.Color(ProjectileColor),
			originEntityId: this.id,
			splashRadius: 3
		});
	}

	private chase() {
		if (!this._player.dead && !this._player.auraEngine.hasAura(AuraType.Cloaked)) {
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
