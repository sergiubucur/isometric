import * as THREE from "three";

import IMonster from "./IMonster";
import IWorld from "../../world/IWorld";
import IPlayer from "../player/IPlayer";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../movement/IEntityMovementEngine";

const Size = 1;
const Speed = 0.1;
const MeshRadius = 0.5;
const MeshHeight = 2;
const MeshRadialSegments = 16;
const Color = 0xff0000;

export default class Monster implements IMonster {
	id: number;

	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;

	constructor(private _world: IWorld, private _player: IPlayer, private _entityId: IEntityId,
		private _movementEngine: IEntityMovementEngine) {

		this.id = this._entityId.getNewId();
	}

	init(position: THREE.Vector3) {
		this._movementEngine.init(this.id, position, Size, Speed);
		this._movementEngine.afterPositionUpdate = () => {
			this.updateMeshPosition();
		};

		this.initMesh();
	}

	update() {
		this.chase();
		this._movementEngine.move();
	}

	private chase() {
		this._movementEngine.startMovingTo(this._player.position);
	}

	private initMesh() {
		const geometry = new THREE.CylinderBufferGeometry(MeshRadius, MeshRadius, MeshHeight, MeshRadialSegments);
		const material = new THREE.MeshPhongMaterial({ color: Color });

		this._mesh = new THREE.Mesh(geometry, material);

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
		this._mesh.position.y += MeshHeight / 2;
	}
}
