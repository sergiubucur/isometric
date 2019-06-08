import * as THREE from "three";

import IPlayer from "./IPlayer";
import IMouseControls from "./mouse-controls/IMouseControls";
import ICamera from "../../camera/ICamera";
import IInputTracker from "../../input-tracker/IInputTracker";
import IWorld from "../../world/IWorld";
import ILogger from "../../common/logger/ILogger";
import IEntityId from "../entity-id/IEntityId";

const Speed = 0.25;
const TeleportCooldown = 17;

// TODO: extract common parts from Monster and Player into separate classes
export default class Player implements IPlayer {
	get position() {
		return this._position;
	}

	id: number;

	private _position: THREE.Vector3;
	private _velocity: THREE.Vector3;
	private _steps: number;
	private _teleportCooldown: number;
	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;

	constructor(private _mouseControls: IMouseControls, private _camera: ICamera, private _inputTracker: IInputTracker,
		private _world: IWorld, private _logger: ILogger, private _entityId: IEntityId) {

		this._mouseControls.onLeftClick = (mousePosition) => this.handleLeftClick(mousePosition);
		this._mouseControls.onRightClick = (mousePosition) => this.handleRightClick(mousePosition);

		this.id = _entityId.getNewId();
		this._position = new THREE.Vector3(Math.floor(this._world.map.size / 2), 0, Math.floor(this._world.map.size / 2));
		this._velocity = new THREE.Vector3();
		this._steps = 0;
		this._teleportCooldown = 0;

		this._camera.setPosition(this._position);
		this.modifyCells(true);

		this.initMesh();
	}

	update() {
		this._mouseControls.update();
		this.move();

		this._logger.logVector3("position", this._position);
		this._logger.logNumber("steps", this._steps);
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

		if (this._teleportCooldown > 0) {
			this._teleportCooldown--;
		}

		this._logger.logNumber("teleportCooldown", this._teleportCooldown);
	}

	private canMove(position: THREE.Vector3) {
		const size = 2;
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

	private handleLeftClick(mousePosition: THREE.Vector3) {
		this._velocity.copy(mousePosition).sub(this._position).normalize().multiplyScalar(Speed);
		this._steps = Math.ceil(mousePosition.clone().sub(this._position).length() / Speed);
	}

	private handleRightClick(mousePosition: THREE.Vector3) {
		if (this._teleportCooldown === 0) {
			this._steps = 0;
			this._teleportCooldown = TeleportCooldown;

			if (this.canMove(mousePosition)) {
				this.updatePosition(mousePosition);
			}
		}
	}

	private updatePosition(v: THREE.Vector3 | number, y?: number, z?: number) {
		this.modifyCells(false);

		if (v instanceof THREE.Vector3) {
			this._position.copy(v);
		} else {
			this._position.set(v, y, z);
		}

		this.modifyCells(true);
		this._camera.setPosition(this._position);
		this.updateMeshPosition();
	}

	private modifyCells(occupy?: boolean) {
		const size = 2;
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
		const geometry = new THREE.CylinderBufferGeometry(0.75, 0.75, 4, 16);
		const material = new THREE.MeshPhongMaterial({ color: 0xbada55 });

		this._mesh = new THREE.Mesh(geometry, material);
		this._pointLight = new THREE.PointLight(0xbada55, 3, 5);
		this._pointLight.position.set(0, 0.5, 0);
		this._mesh.add(this._pointLight);

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._position);
		this._mesh.position.y += 2;
	}
}
