import * as THREE from "three";

import BaseSpell from "../BaseSpell";

const ProjectileColor = 0xbada55;
const ProjectileSpeed = 0.5;

export default class Nova extends BaseSpell {
	constructor() {
		super();

		this.name = "Nova";
		this.manaCost = 50;
		this.iconName = "ra-sun-symbol";
	}

	cast() {
		for (let i = 0; i < 10; i++) {
			const targetPosition = new THREE.Vector3();
			targetPosition.x = Math.cos(Math.PI / 180 * i * 36);
			targetPosition.z = Math.sin(Math.PI / 180 * i * 36);
			targetPosition.add(this._movementEngine.position);

			this.throwProjectile(targetPosition);
		}
	}

	private throwProjectile(targetPosition: THREE.Vector3) {
		this._world.addProjectile({
			startPosition: this._movementEngine.position,
			targetPosition,
			speed: ProjectileSpeed,
			color: new THREE.Color(ProjectileColor),
			originEntityId: this._player.id,
			splashRadius: 3
		});
	}
}
