import * as THREE from "three";

import IWorld from "../../world/IWorld";

export default class EntityMovementEngine {
	afterPositionUpdate: () => void;
	id: number;
	position: THREE.Vector3;
	size: number;
	speed: number;

	private _velocity: THREE.Vector3;
	private _steps: number;

	constructor(private _world: IWorld) {
		this.position = new THREE.Vector3();
		this._velocity = new THREE.Vector3();
		this._steps = 0;

		this.afterPositionUpdate = () => {};
	}

	init(id: number, position: THREE.Vector3, size: number, speed: number) {
		this.id = id;
		this.position.copy(position);
		this.size = size;
		this.speed = speed;

		this.modifyCells(true);
	}

	move() {
		if (this._steps > 0) {
			let position = null;

			const positionXZ = this.position.clone().add(new THREE.Vector3(this._velocity.x, 0, this._velocity.z));
			const canMoveXZ = this.canMoveTo(positionXZ);

			if (canMoveXZ) {
				position = positionXZ;
			} else {
				const positionX = this.position.clone().add(new THREE.Vector3(this._velocity.x, 0, 0));
				const canMoveX = this.canMoveTo(positionX);

				if (canMoveX) {
					position = positionX;
				} else {
					const positionZ = this.position.clone().add(new THREE.Vector3(0, 0, this._velocity.z));
					const canMoveZ = this.canMoveTo(positionZ);

					if (canMoveZ) {
						position = positionZ;
					}
				}
			}

			if (position) {
				this.moveTo(position);
				this._steps--;
			} else {
				this._steps = 0;
			}
		}
	}

	startMovingTo(position: THREE.Vector3) {
		this._velocity.copy(position).sub(this.position).normalize().multiplyScalar(this.speed);
		this._steps = Math.ceil(position.clone().sub(this.position).length() / this.speed);
	}

	canMoveTo(position: THREE.Vector3) {
		const radius = this.size / 2;

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

	stop() {
		this._steps = 0;
	}

	moveTo(position: THREE.Vector3) {
		this.modifyCells(false);
		this.position.copy(position);
		this.modifyCells(true);

		this.afterPositionUpdate();
	}

	private modifyCells(occupy?: boolean) {
		const radius = this.size / 2;

		const p0 = this.position.clone();
		p0.x -= radius;
		p0.z -= radius;

		const c0 = this._world.map.convertToMapPosition(p0);

		const p1 = this.position.clone();
		p1.x += radius;
		p1.z += radius;

		const c1 = this._world.map.convertToMapPosition(p1);

		for (let x = c0.x; x <= c1.x; x++) {
			for (let z = c0.z; z <= c1.z; z++) {
				if (occupy) {
					if (this._world.map.getCell(x, z)) {
						this._world.map.occupyCell(x, z, this.id);
					}
				} else {
					if (this._world.map.getCell(x, z)) {
						this._world.map.vacateCell(x, z);
					}
				}
			}
		}
	}
}
