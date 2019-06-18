import * as THREE from "three";

import BaseSpell from "../BaseSpell";

const ProjectileColor = 0xbada55;
const ProjectileSpeed = 0.5;

export default class Fireball extends BaseSpell {
	constructor() {
		super();

		this.name = "Fireball";
		this.manaCost = 10;
		this.iconName = "ra-burning-meteor";
		this.flipIcon = true;
	}

	cast() {
		this._movementEngine.velocity.copy(this._mouseControls.mousePosition).sub(this._movementEngine.position);
		this._player.updateMeshPosition();

		this.throwProjectile();
	}

	private throwProjectile() {
		this._world.addProjectile({
			startPosition: this._movementEngine.position,
			targetPosition: this._mouseControls.mousePosition,
			speed: ProjectileSpeed,
			color: new THREE.Color(ProjectileColor),
			originEntityId: this._player.id,
			splashRadius: 3
		});
	}
}
