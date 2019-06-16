import * as THREE from "three";

import IEntityDeathAnimationEngine from "./IEntityDeathAnimationEngine";

const DeathAnimationTotalFrames = 30;

export default class EntityDeathAnimationEngine implements IEntityDeathAnimationEngine {
	onAnimationComplete: () => void;

	private _deathAnimationFrames: number;
	private _mesh: THREE.Mesh;
	private _size: number;

	constructor() {
		this.onAnimationComplete = () => {};
		this._deathAnimationFrames = 0;
	}

	init(mesh: THREE.Mesh, size: number) {
		this._mesh = mesh;
		this._size = size;
	}

	startAnimation() {
		this._deathAnimationFrames = DeathAnimationTotalFrames;
	}

	runAnimation() {
		if (this._deathAnimationFrames > 0) {
			this._deathAnimationFrames--;

			const value = this._deathAnimationFrames / DeathAnimationTotalFrames;
			this._mesh.rotation.x = -(1 - value) * (Math.PI / 2);
			this._mesh.position.y = (this._size / 4) + Math.sin(Math.PI * value) * this._size;

			if (this._deathAnimationFrames === 0) {
				this.onAnimationComplete();
			}
		}
	}

	cancelAnimation() {
		this._mesh.rotation.x = 0;
		this._deathAnimationFrames = 0;
	}
}
