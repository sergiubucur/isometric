import * as THREE from "three";

import ICameraControls from "./ICameraControls";
import ICamera from "./ICamera";
import IInputTracker from "../input-tracker/IInputTracker";
import IScene from "../scene/IScene";
import ILogger from "../logger/ILogger";

export default class MouseControls implements ICameraControls {
	private readonly _camera: ICamera;
	private readonly _inputTracker: IInputTracker;
	private readonly _scene: IScene;
	private readonly _logger: ILogger;

	private _position: THREE.Vector3;
	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;

	constructor(camera: ICamera, inputTracker: IInputTracker, scene: IScene, logger: ILogger) {
		this._camera = camera;
		this._inputTracker = inputTracker;
		this._scene = scene;
		this._logger = logger;

		this._position = new THREE.Vector3(16, 0, 16);

		this._camera.setPosition(this._position);

		this.initMesh();
	}

	update() {
		let zoomVelocity = this._inputTracker.wheelEvents.reduce((a, x) => a + x, 0);
		if (zoomVelocity !== 0) {
			this._camera.setZoom(this._camera.zoom + (zoomVelocity * 2));
		}

		this._logger.logVector3("position", this._position);
		this._logger.logNumber("zoom", this._camera.zoom);
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

	private updateMeshPosition() {
		this._mesh.position.copy(this._position);
		this._mesh.position.y += 2;
	}
}
