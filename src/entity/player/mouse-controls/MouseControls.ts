import * as THREE from "three";

import ICamera from "../../../camera/ICamera";
import IInputTracker from "../../../input-tracker/IInputTracker";
import IWorld from "../../../world/IWorld";
import ILogger from "../../../common/logger/ILogger";
import IMouseControls from "./IMouseControls";

export default class MouseControls implements IMouseControls {
	onLeftClick: (mousePosition: THREE.Vector3) => void;
	onRightClick: (mousePosition: THREE.Vector3) => void;

	private _pointerMesh: THREE.Mesh;
	private _plane: THREE.Plane;

	constructor(private _camera: ICamera, private _inputTracker: IInputTracker, private _world: IWorld, private _logger: ILogger) {
		this.onLeftClick = () => {};
		this.onRightClick = () => {};

		this._plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));

		this.initPointerMesh();
	}

	update() {
		this.updateMousePosition();
		this.updateZoomLevel();

		this._logger.logNumber("zoom", this._camera.zoom);
	}

	private updateMousePosition() {
		const mouseX = (this._inputTracker.mouseX / window.innerWidth) * 2 - 1;
		const mouseY = -(this._inputTracker.mouseY / window.innerHeight) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera({ x: mouseX, y: mouseY }, this._camera.camera);

		let mousePosition = new THREE.Vector3();
		raycaster.ray.intersectPlane(this._plane, mousePosition);

		mousePosition = this._world.map.convertToMapPosition(mousePosition);

		if (this._inputTracker.leftMouseDown) {
			this.onLeftClick(mousePosition);
		}
		if (this._inputTracker.rightMouseDown) {
			this.onRightClick(mousePosition);
		}

		this._pointerMesh.position.set(mousePosition.x, 0.05, mousePosition.z);
		this._logger.logVector3("mousePosition", mousePosition);
	}

	private updateZoomLevel() {
		let zoomVelocity = this._inputTracker.wheelEvents.reduce((a, x) => a + x, 0);
		if (zoomVelocity !== 0) {
			this._camera.setZoom(this._camera.zoom + (zoomVelocity * 2));
		}
	}

	private initPointerMesh() {
		const geometry = new THREE.BoxBufferGeometry();
		const material = new THREE.MeshPhongMaterial({ color: 0xbada55 });
		material.opacity = 0.5;
		material.transparent = true;

		this._pointerMesh = new THREE.Mesh(geometry, material);
		this._pointerMesh.scale.set(1, 0.1, 1);

		this._world.addMesh(this._pointerMesh);
	}
}
