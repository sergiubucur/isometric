import * as THREE from "three";

import IPlayer from "./IPlayer";
import IMouseControls from "./mouse-controls/IMouseControls";
import ICamera from "../camera/ICamera";
import IInputTracker from "../input-tracker/IInputTracker";
import IWorld from "../world/IWorld";
import ILogger from "../common/logger/ILogger";
import CellType from "../world/map/CellType";

const Speed = 0.25;
const TeleportCooldown = 17;

export default class Player implements IPlayer {
	private _position: THREE.Vector3;
	private _mapPosition: THREE.Vector3;
	private _velocity: THREE.Vector3;
	private _target: THREE.Vector3;
	private _steps: number;
	private _teleportCooldown: number;
	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;

	constructor(private _mouseControls: IMouseControls, private _camera: ICamera, private _inputTracker: IInputTracker,
		private _world: IWorld, private _logger: ILogger) {

		this._mouseControls.onLeftClick = (mousePosition) => this.handleLeftClick(mousePosition);
		this._mouseControls.onRightClick = (mousePosition) => this.handleRightClick(mousePosition);

		this._position = new THREE.Vector3(Math.floor(this._world.map.size / 2), 0, Math.floor(this._world.map.size / 2));
		this._mapPosition = this._position.clone();
		this._velocity = new THREE.Vector3();
		this._target = new THREE.Vector3();
		this._steps = 0;
		this._teleportCooldown = 0;

		this._camera.setPosition(this._position);

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
				this._position.copy(position);
				this.updatePosition();

				this._steps--;
				// if (this._steps === 0) {
				// 	this.updatePosition(this._target);
				// }
			} else {
				this._steps = 0;
				// this.updatePosition(this._mapPosition);
			}
		}

		if (this._teleportCooldown > 0) {
			this._teleportCooldown--;
		}

		this._logger.logNumber("teleportCooldown", this._teleportCooldown);
	}

	private canMove(position: THREE.Vector3) {
		const offsets = [
			{ x: -1, z: -1 },
			{ x: 0, z: -1 },
			{ x: 1, z: -1 },
			{ x: -1, z: 0 },
			{ x: 0, z: 0 },
			{ x: 1, z: 0 },
			{ x: -1, z: 1 },
			{ x: 0, z: 1 },
			{ x: 1, z: 1 },
		];

		const size = 1.5;
		const radius = size / 2;

		for (let i = 0; i < offsets.length; i++) {
			const nextCell = this.getNextCell(position, offsets[i].x * radius, offsets[i].z * radius);

			if (!nextCell || nextCell.type !== CellType.EmptyFloor) {
				return false;
			}
		}

		return true;
	}

	private getNextCell(position: THREE.Vector3, offsetX: number, offsetZ: number) {
		const newPosition = position.clone();
		newPosition.x += offsetX;
		newPosition.z += offsetZ;

		const nextMapPosition = this._world.map.convertToMapPosition(newPosition);
		const nextCell = this._world.map.getCell(nextMapPosition.x, nextMapPosition.z);

		return nextCell;
	}

	private handleLeftClick(mousePosition: THREE.Vector3) {
		this._target.copy(mousePosition);
		this._velocity.copy(this._target).sub(this._position).normalize().multiplyScalar(Speed);
		this._steps = Math.ceil(this._target.clone().sub(this._position).length() / Speed);
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

	private updatePosition(v?: THREE.Vector3 | number, y?: number, z?: number) {
		if (v !== undefined) {
			if (v instanceof THREE.Vector3) {
				this._position.copy(v);
			} else {
				this._position.set(v, y, z);
			}
		}

		this._mapPosition = this._world.map.convertToMapPosition(this._position);
		this._camera.setPosition(this._position);
		this.updateMeshPosition();
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
