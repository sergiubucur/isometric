import * as THREE from "three";

import IPlayer from "./IPlayer";
import IMouseControls from "./mouse-controls/IMouseControls";
import ICamera from "../../camera/ICamera";
import IInputTracker from "../../input-tracker/IInputTracker";
import IWorld from "../../world/IWorld";
import ILogger from "../../common/logger/ILogger";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../movement/IEntityMovementEngine";

const Size = 2;
const Speed = 0.25;
const TeleportCooldown = 17;
const MeshRadius = 0.75;
const MeshHeight = 4;
const MeshRadialSegments = 16;
const Color = 0xbada55;
const PointLightIntensity = 3;
const PointLightDistance = 5;
const PointLightYOffset = 0.5;

export default class Player implements IPlayer {
	get position() {
		return this._movementEngine.position;
	}

	id: number;

	private _teleportCooldown: number;
	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;

	constructor(private _mouseControls: IMouseControls, private _camera: ICamera, private _inputTracker: IInputTracker,
		private _world: IWorld, private _logger: ILogger, private _entityId: IEntityId, private _movementEngine: IEntityMovementEngine) {

		this._mouseControls.onLeftClick = (mousePosition) => this.handleLeftClick(mousePosition);
		this._mouseControls.onRightClick = (mousePosition) => this.handleRightClick(mousePosition);

		this.id = this._entityId.getNewId();
		this._teleportCooldown = 0;

		const startPosition = new THREE.Vector3(Math.floor(this._world.map.size / 2), 0, Math.floor(this._world.map.size / 2));
		this._movementEngine.init(this.id, startPosition, Size, Speed);
		this._movementEngine.afterPositionUpdate = () => {
			this._camera.setPosition(this._movementEngine.position);
			this.updateMeshPosition();
		};

		this._camera.setPosition(startPosition);
		this.initMesh();
	}

	update() {
		this._mouseControls.update();
		this.move();

		this._logger.logVector3("position", this._movementEngine.position);
	}

	private move() {
		this._movementEngine.move();

		if (this._teleportCooldown > 0) {
			this._teleportCooldown--;
		}

		this._logger.logNumber("teleportCooldown", this._teleportCooldown);
	}

	private handleLeftClick(mousePosition: THREE.Vector3) {
		this._movementEngine.startMovingTo(mousePosition);
	}

	private handleRightClick(mousePosition: THREE.Vector3) {
		if (this._teleportCooldown === 0) {
			this._movementEngine.stop();
			this._teleportCooldown = TeleportCooldown;

			if (this._movementEngine.canMoveTo(mousePosition)) {
				this._movementEngine.moveTo(mousePosition);
			}
		}
	}

	private initMesh() {
		const geometry = new THREE.CylinderBufferGeometry(MeshRadius, MeshRadius, MeshHeight, MeshRadialSegments);
		const material = new THREE.MeshPhongMaterial({ color: Color });

		this._mesh = new THREE.Mesh(geometry, material);
		this._pointLight = new THREE.PointLight(Color, PointLightIntensity, PointLightDistance);
		this._pointLight.position.set(0, PointLightYOffset, 0);
		this._mesh.add(this._pointLight);

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
		this._mesh.position.y += MeshHeight / 2;
	}
}
