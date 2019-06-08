import * as THREE from "three";

import IMonster from "./IMonster";
import IWorld from "../world/IWorld";
import IPlayer from "../player/IPlayer";
import IEntityId from "../common/entity-id/IEntityId";

const Speed = 0.1;

// TODO: extract common parts from Monster and Player into separate classes
export default class Monster implements IMonster {
	id: number;

	private _position: THREE.Vector3;
	private _velocity: THREE.Vector3;
	private _steps: number;
	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;

	constructor(private _world: IWorld, private _player: IPlayer, private _entityId: IEntityId) {
		this.id = this._entityId.getNewId();
		this._position = new THREE.Vector3();
		this._velocity = new THREE.Vector3();
		this._steps = 0;
	}

	init(position: THREE.Vector3) {
		this._position.copy(position);
		this.modifyCells(true);

		this.initMesh();
	}

	update() {
		this.chase();
		this.move();
	}

	private move() {
		if (this._steps > 0) {
			let position = null;

			const positionXZ = this._position.clone().add(new THREE.Vector3(this._velocity.x, 0, this._velocity.z));
			const canMoveXZ = this.canMove(positionXZ);

			if (canMoveXZ) {
				position = positionXZ;
			} else {
				const positionX = this._position.clone().add(new THREE.Vector3(this._velocity.x, 0, 0));
				const canMoveX = this.canMove(positionX);

				if (canMoveX) {
					position = positionX;
				} else {
					const positionZ = this._position.clone().add(new THREE.Vector3(0, 0, this._velocity.z));
					const canMoveZ = this.canMove(positionZ);

					if (canMoveZ) {
						position = positionZ;
					}
				}
			}

			if (position) {
				this.updatePosition(position);
				this._steps--;
			} else {
				this._steps = 0;
			}
		}
	}

	private canMove(position: THREE.Vector3) {
		const size = 1;
		const radius = size / 2;

		const p0 = position.clone();
		p0.x -= radius;
		p0.z -= radius;

		const c0 = this._world.map.convertToMapPosition(p0);

		const p1 = position.clone();
		p1.x += radius;
		p1.z += radius;

		const c1 = this._world.map.convertToMapPosition(p1);

		for (let x = c0.x; x <= c1.x; x++) {
			for (let z = c0.z; z <= c1.z; z++) {
				if (!this._world.map.isCellPassable(x, z, this.id)) {
					return false;
				}
			}
		}

		return true;
	}

	private chase() {
		this._velocity.copy(this._player.position).sub(this._position).normalize().multiplyScalar(Speed);
		this._steps = Math.ceil(this._player.position.clone().sub(this._position).length() / Speed);
	}

	private updatePosition(v: THREE.Vector3 | number, y?: number, z?: number) {
		this.modifyCells(false);

		if (v instanceof THREE.Vector3) {
			this._position.copy(v);
		} else {
			this._position.set(v, y, z);
		}

		this.modifyCells(true);
		this.updateMeshPosition();
	}

	private modifyCells(occupy?: boolean) {
		const size = 1;
		const radius = size / 2;

		const p0 = this._position.clone();
		p0.x -= radius;
		p0.z -= radius;

		const c0 = this._world.map.convertToMapPosition(p0);

		const p1 = this._position.clone();
		p1.x += radius;
		p1.z += radius;

		const c1 = this._world.map.convertToMapPosition(p1);

		if (occupy) {
			for (let x = c0.x; x <= c1.x; x++) {
				for (let z = c0.z; z <= c1.z; z++) {
					if (this._world.map.getCell(x, z)) {
						this._world.map.occupyCell(x, z, this.id);
					}
				}
			}
		} else {
			for (let x = c0.x; x <= c1.x; x++) {
				for (let z = c0.z; z <= c1.z; z++) {
					if (this._world.map.getCell(x, z)) {
						this._world.map.vacateCell(x, z);
					}
				}
			}
		}
	}

	private initMesh() {
		const geometry = new THREE.CylinderBufferGeometry(0.5, 0.5, 2, 16);
		const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });

		this._mesh = new THREE.Mesh(geometry, material);
		this._pointLight = new THREE.PointLight(0xff0000, 2, 3);
		this._pointLight.position.set(0, 0.5, 0);
		this._mesh.add(this._pointLight);

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._position);
		this._mesh.position.y += 1;
	}
}
