import * as THREE from "three";

import ICameraControls from "./ICameraControls";
import ICamera from "./ICamera";
import IInputTracker from "../input-tracker/IInputTracker";
import IScene from "../scene/IScene";
import ILogger from "../logger/ILogger";

const Speed = 0.25;

export default class MouseControls implements ICameraControls {
	private readonly _camera: ICamera;
	private readonly _inputTracker: IInputTracker;
	private readonly _scene: IScene;
	private readonly _logger: ILogger;

	private _position: THREE.Vector3;
	private _velocity: THREE.Vector3;
	private _target: THREE.Vector3;
	private _steps: number;
	private _mesh: THREE.Mesh;
	private _pointerMesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;
	private _plane: THREE.Plane;
	private _rightMousePressed: boolean;

	constructor(camera: ICamera, inputTracker: IInputTracker, scene: IScene, logger: ILogger) {
		this._camera = camera;
		this._inputTracker = inputTracker;
		this._scene = scene;
		this._logger = logger;

		this._position = new THREE.Vector3(16, 0, 16);
		this._velocity = new THREE.Vector3();
		this._target = new THREE.Vector3();
		this._steps = 0;
		this._plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
		this._rightMousePressed = false;

		this._camera.setPosition(this._position);

		this.initMesh();
		this.initPointerMesh();
	}

	update() {
		if (!this._inputTracker.rightMouseDown) {
			this._rightMousePressed = false;
		}

		this.updateMousePosition();
		this.updateZoomLevel();
		this.move();

		this._logger.logVector3("position", this._position);
		this._logger.logNumber("zoom", this._camera.zoom);
		this._logger.logNumber("steps", this._steps);
	}

	private move() {
		if (this._steps > 0) {
			this._position.add(this._velocity);
			this._camera.setPosition(this._position);
			this.updateMeshPosition();

			this._steps--;
			if (this._steps === 0) {
				this._position = this._target;
			}
		}
	}

	private updateMousePosition() {
		const mouseX = (this._inputTracker.mouseX / window.innerWidth) * 2 - 1;
		const mouseY = -(this._inputTracker.mouseY / window.innerHeight) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera({ x: mouseX, y: mouseY }, this._camera.camera);

		const position = new THREE.Vector3();
		raycaster.ray.intersectPlane(this._plane, position);

		const mousePosition = new THREE.Vector2(
			THREE.Math.clamp(Math.round(position.x), 0, 32),
			THREE.Math.clamp(Math.round(position.z), 0, 32)
		);

		if (this._inputTracker.leftMouseDown) {
			this.handleLeftClick(mousePosition);
		}
		if (this._inputTracker.rightMouseDown && !this._rightMousePressed) {
			this.handleRightClick(mousePosition);
			this._rightMousePressed = true;
		}

		this._pointerMesh.position.set(mousePosition.x, 0.05, mousePosition.y);
		this._logger.logVector2("gridPosition", mousePosition);
	}

	private handleLeftClick(mousePosition: THREE.Vector2) {
		this._target = new THREE.Vector3(mousePosition.x, 0, mousePosition.y);
		this._velocity.copy(this._target).sub(this._position).normalize().multiplyScalar(Speed);
		this._steps = Math.ceil(this._target.clone().sub(this._position).length() / Speed);
	}

	private handleRightClick(mousePosition: THREE.Vector2) {
		this._steps = 0;

		this._position.set(mousePosition.x, 0, mousePosition.y);
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

		this._pointerMesh = new THREE.Mesh(geometry, material);
		this._pointerMesh.scale.set(1, 0.1, 1);

		this._scene.scene.add(this._pointerMesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._position);
		this._mesh.position.y += 2;
	}
}
