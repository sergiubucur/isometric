import * as THREE from "three";

import ITankControls from "./ITankControls";
import ICamera from "./ICamera";
import IInputTracker from "../input-tracker/IInputTracker";
import Keybinds from "../input-tracker/Keybinds";

const Speed = 0.25;

export default class TankControls implements ITankControls {
	private readonly _camera: ICamera;
	private readonly _inputTracker: IInputTracker;

	private _position: THREE.Vector3;
	private _velocity: THREE.Vector3;

	constructor(camera: ICamera, inputTracker: IInputTracker) {
		this._camera = camera;
		this._inputTracker = inputTracker;

		this._position = new THREE.Vector3(0, 0, 0);
		this._velocity = new THREE.Vector3(0, 0, 0);

		this._camera.setPosition(this._position);
	}

	update() {
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

		this._position.add(this._velocity);
		this._camera.setPosition(this._position);

		let zoomVelocity = this._inputTracker.wheelEvents.reduce((a, x) => a + x, 0);
		if (zoomVelocity !== 0) {
			this._camera.setZoom(this._camera.zoom + zoomVelocity);
		}
	}
}
