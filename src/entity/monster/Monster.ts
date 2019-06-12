import * as THREE from "three";

import IMonster from "./IMonster";
import IWorld from "../../world/IWorld";
import IPlayer from "../player/IPlayer";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../movement/IEntityMovementEngine";
import IAssetService from "../../asset/IAssetService";

const Size = 1;
const Speed = 0.1;
const Color = 0xff0000;
const DeathAnimationTotalFrames = 30;
const MeshName = "human";

export default class Monster implements IMonster {
	id: number;

	private _mesh: THREE.Mesh;
	private _isDead: boolean;
	private _deathAnimationFrames: number;

	constructor(private _world: IWorld, private _player: IPlayer, private _entityId: IEntityId,
		private _movementEngine: IEntityMovementEngine, private _assetService: IAssetService) {

		this.id = this._entityId.getNewId();
		this._isDead = false;
		this._deathAnimationFrames = DeathAnimationTotalFrames;
	}

	init(position: THREE.Vector3) {
		this._movementEngine.init(this.id, position, Size, Speed);
		this._movementEngine.afterPositionUpdate = () => {
			this.updateMeshPosition();
		};

		this.initMesh();
	}

	update() {
		if (this._isDead) {
			if (this._deathAnimationFrames > 0) {
				this._deathAnimationFrames--;

				const value = this._deathAnimationFrames / DeathAnimationTotalFrames;
				this._mesh.rotation.x = (1 - value) * (Math.PI / 2);
				this._mesh.position.y = (Size / 4) + Math.sin(Math.PI * value) * Size;
			}

			return;
		}

		this.chase();
		this._movementEngine.move();
	}

	damage() {
		if (this._isDead) {
			return;
		}

		this._isDead = true;
		this._movementEngine.clearCells();
	}

	private chase() {
		this._movementEngine.startMovingTo(this._player.position);
	}

	private initMesh() {
		const geometry = (this._assetService.assets[MeshName].content as THREE.Mesh).geometry;
		const material = new THREE.MeshPhongMaterial({ color: Color });

		this._mesh = new THREE.Mesh(geometry, material);
		this._mesh.scale.set(Size, Size, Size);

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
	}
}
