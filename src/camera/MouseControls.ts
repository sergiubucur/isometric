import * as THREE from "three";

import ICameraControls from "./ICameraControls";
import ICamera from "./ICamera";
import IInputTracker from "../input-tracker/IInputTracker";
import IScene from "../scene/IScene";
import ILogger from "../logger/ILogger";
import CellType from "../scene/CellType";

const Speed = 0.25;
const TeleportCooldown = 17;

export default class MouseControls implements ICameraControls {
	private readonly _camera: ICamera;
	private readonly _inputTracker: IInputTracker;
	private readonly _scene: IScene;
	private readonly _logger: ILogger;

	private _position: THREE.Vector3;
	private _mapPosition: THREE.Vector3;
	private _velocity: THREE.Vector3;
	private _target: THREE.Vector3;
	private _steps: number;
	private _teleportCooldown: number;
	private _mesh: THREE.Mesh;
	private _pointerMesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;
	private _plane: THREE.Plane;

	constructor(camera: ICamera, inputTracker: IInputTracker, scene: IScene, logger: ILogger) {
		this._camera = camera;
		this._inputTracker = inputTracker;
		this._scene = scene;
		this._logger = logger;

		this._position = new THREE.Vector3(Math.floor(this._scene.mapSize / 2), 0, Math.floor(this._scene.mapSize / 2));
		this._mapPosition = this._position.clone();
		this._velocity = new THREE.Vector3();
		this._target = new THREE.Vector3();
		this._steps = 0;
		this._teleportCooldown = 0;
		this._plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));

		this._camera.setPosition(this._position);

		this.initMesh();
		this.initPointerMesh();
	}

	update() {
		this.updateMousePosition();
		this.updateZoomLevel();
		this.move();

		this._logger.logVector3("position", this._position);
		this._logger.logNumber("zoom", this._camera.zoom);
		this._logger.logNumber("steps", this._steps);
	}

	private move() {
		if (this._steps > 0) {
			const nextMapPosition = this._scene.convertToMapPosition(this._position.clone().add(this._velocity));
			const nextCell = this._scene.map[nextMapPosition.z][nextMapPosition.x];

			if (nextCell.type === CellType.EmptyFloor) {
				this._position.add(this._velocity);
				this.updatePosition();

				this._steps--;
				if (this._steps === 0) {
					this.updatePosition(this._target);
				}
			} else {
				this._steps = 0;
				this.updatePosition(this._mapPosition);
			}
		}

		if (this._teleportCooldown > 0) {
			this._teleportCooldown--;
		}
	}

	private updateMousePosition() {
		const mouseX = (this._inputTracker.mouseX / window.innerWidth) * 2 - 1;
		const mouseY = -(this._inputTracker.mouseY / window.innerHeight) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera({ x: mouseX, y: mouseY }, this._camera.camera);

		let mousePosition = new THREE.Vector3();
		raycaster.ray.intersectPlane(this._plane, mousePosition);

		mousePosition = this._scene.convertToMapPosition(mousePosition, true);

		if (this._inputTracker.leftMouseDown) {
			this.handleLeftClick(mousePosition);
		}
		if (this._inputTracker.rightMouseDown) {
			this.handleRightClick(mousePosition);
		}

		this._pointerMesh.position.set(mousePosition.x, 0.05, mousePosition.z);
		this._logger.logVector3("mousePosition", mousePosition);
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

			const nextCell = this._scene.map[mousePosition.z][mousePosition.x];
			if (nextCell.type === CellType.EmptyFloor) {
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

		this._mapPosition = this._scene.convertToMapPosition(this._position);
		this._camera.setPosition(this._position);
		this.updateMeshPosition();
	}

	private updateZoomLevel() {
		let zoomVelocity = this._inputTracker.wheelEvents.reduce((a, x) => a + x, 0);
		if (zoomVelocity !== 0) {
			this._camera.setZoom(this._camera.zoom + (zoomVelocity * 2));
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

		this._scene.scene.add(this._mesh);
	}

	private initPointerMesh() {
		const geometry = new THREE.BoxBufferGeometry();
		const material = new THREE.MeshPhongMaterial({ color: 0xbada55 });
		material.opacity = 0.5;
		material.transparent = true;

		this._pointerMesh = new THREE.Mesh(geometry, material);
		this._pointerMesh.scale.set(1, 0.1, 1);

		this._scene.scene.add(this._pointerMesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._position);
		this._mesh.position.y += 2;
	}
}
