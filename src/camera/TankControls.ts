import * as THREE from "three";

import ITankControls from "./ITankControls";
import ICamera from "./ICamera";
import IInputTracker from "../input-tracker/IInputTracker";
import Keybinds from "../input-tracker/Keybinds";
import IScene from "../scene/IScene";
import ILogger from "../logger/ILogger";

const Speed = 0.25;

export default class TankControls implements ITankControls {
	private readonly _camera: ICamera;
	private readonly _inputTracker: IInputTracker;
	private readonly _scene: IScene;
	private readonly _logger: ILogger;

	private _position: THREE.Vector3;
	private _velocity: THREE.Vector3;
	private _mesh: THREE.Mesh;

	constructor(camera: ICamera, inputTracker: IInputTracker, scene: IScene, logger: ILogger) {
		this._camera = camera;
		this._inputTracker = inputTracker;
		this._scene = scene;
		this._logger = logger;

		this._position = new THREE.Vector3(16, 0, 16);
		this._velocity = new THREE.Vector3(0, 0, 0);

		this._camera.setPosition(this._position);

		this.initMesh();
	}

	update() {
		this.updateVelocity();

		this._position.add(this._velocity);
		this._camera.setPosition(this._position);
		this.updateMeshPosition();

		let zoomVelocity = this._inputTracker.wheelEvents.reduce((a, x) => a + x, 0);
		if (zoomVelocity !== 0) {
			this._camera.setZoom(this._camera.zoom + zoomVelocity);
		}

		this._logger.logVector3("position", this._position);
	}

	private updateVelocity() {
		this._velocity.set(0, 0, 0);

		if (this._inputTracker.keysPressed[Keybinds.W]) {
			this._velocity.z -= Speed;
		}
		if (this._inputTracker.keysPressed[Keybinds.S]) {
			this._velocity.z += Speed;
		}
		if (this._inputTracker.keysPressed[Keybinds.A]) {
			this._velocity.x -= Speed;
		}
		if (this._inputTracker.keysPressed[Keybinds.D]) {
			this._velocity.x += Speed;
		}
		if (this._inputTracker.keysPressed[Keybinds.Up]) {
			this._velocity.y += Speed;
		}
		if (this._inputTracker.keysPressed[Keybinds.Down]) {
			this._velocity.y -= Speed;
		}
	}

	private initMesh() {
		const geometry = new THREE.CylinderBufferGeometry(0.45, 0.75, 3, 16);
		const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0.3, 0.6, 0.9) });

		this._mesh = new THREE.Mesh(geometry, material);
		this.updateMeshPosition();

		this._scene.scene.add(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._position);
		this._mesh.position.y += 1;
	}
}
