import * as THREE from "three";

import IDoor from "./IDoor";
import { Rectangle } from "../../world/map/loader/IMapLoader";
import IWorld from "../../world/IWorld";
import DoorState from "./DoorState";
import IEntityId from "../entity-id/IEntityId";

const WallHeight = 4;
const AnimationTotalFrames = 60;

export default class Door implements IDoor {
	readonly id: number;

	private _rectangle: Rectangle;
	private _mesh: THREE.Mesh;
	private _yDelta: number;
	private _animationFrames: number;
	private _state: DoorState;

	constructor(private _world: IWorld, private _entityId: IEntityId) {
		this.id = this._entityId.getNewId();
		this._yDelta = 0;
		this._animationFrames = 0;
		this._state = DoorState.Closed;

		(window as any).door = this;
	}

	init(rectangle: Rectangle, mesh: THREE.Mesh) {
		this._rectangle = rectangle;
		this._mesh = mesh;

		this._world.addMesh(mesh);
		this.modifyCells(true);
	}

	update() {
		if (this._animationFrames > 0) {
			this._animationFrames--;
			this._mesh.position.y += this._yDelta;

			if (this._animationFrames === 0) {
				if (this._state === DoorState.Closing) {
					this._state = DoorState.Closed;
				} else {
					if (this._state === DoorState.Opening) {
						this._state = DoorState.Open;
						this.modifyCells(false);
					}
				}
			}

			return;
		}

		if (Math.random() < 0.005) {
			if (this._state === DoorState.Open) {
				this.close();
			} else {
				if (this._state === DoorState.Closed) {
					this.open();
				}
			}
		}
	}

	open() {
		if (this._state !== DoorState.Closed) {
			return;
		}

		this._state = DoorState.Opening;
		this._yDelta = -WallHeight / AnimationTotalFrames;
		this._animationFrames = AnimationTotalFrames;
	}

	close() {
		if (this._state !== DoorState.Open || !this.canClose()) {
			return;
		}

		this._state = DoorState.Closing;
		this._yDelta = WallHeight / AnimationTotalFrames;
		this._animationFrames = AnimationTotalFrames;

		this.modifyCells(true);
	}

	private canClose() {
		for (let x = this._rectangle.x0; x < this._rectangle.x1; x++) {
			for (let z = this._rectangle.y0; z < this._rectangle.y1; z++) {
				if (!this._world.map.isCellPassable(x, z, [this.id])) {
					return false;
				}
			}
		}

		return true;
	}

	private modifyCells(occupy?: boolean) {
		for (let x = this._rectangle.x0; x < this._rectangle.x1; x++) {
			for (let z = this._rectangle.y0; z < this._rectangle.y1; z++) {
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