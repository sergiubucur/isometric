import * as THREE from "three";

import IProjectile from "./IProjectile";
import IEntityMovementEngine from "../movement/IEntityMovementEngine";
import ProjectileData from "./ProjectileData";
import IEntityId from "../entity-id/IEntityId";
import IWorld from "../../world/IWorld";

const Size = 1;
const MeshRadius = 0.5;
const YOffset = 2;

export default class Projectile implements IProjectile {
	id: number;
	toBeDeleted: boolean;

	private _mesh: THREE.Mesh;
	private _data: ProjectileData;

	constructor(private _world: IWorld, private _entityId: IEntityId, private _movementEngine: IEntityMovementEngine) {
		this.id = this._entityId.getNewId();
		this.toBeDeleted = false;
	}

	init(data: ProjectileData) {
		this._data = data;

		this._movementEngine.setProjectileMode(true, this._data.originEntityId, () => this.handleHit());
		this._movementEngine.init(this.id, data.startPosition, Size, data.speed);
		this._movementEngine.afterPositionUpdate = () => {
			this.updateMeshPosition();
		};

		this.initMesh();

		this._movementEngine.startMovingTo(this._data.targetPosition);
	}

	update() {
		this._movementEngine.move();
	}

	dispose() {
		this._world.removeMesh(this._mesh);
		this._mesh = null;
	}

	private handleHit() {
		this._world.areaDamage(this._movementEngine.position, this._data.splashRadius, this._data.originEntityId);

		this._movementEngine.stop();
		this.toBeDeleted = true;
	}

	private initMesh() {
		const geometry = new THREE.SphereGeometry(MeshRadius);
		const material = new THREE.MeshPhongMaterial({ color: this._data.color });
		material.emissive.set(this._data.color);

		this._mesh = new THREE.Mesh(geometry, material);

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
		this._mesh.position.y += YOffset;
	}
}
