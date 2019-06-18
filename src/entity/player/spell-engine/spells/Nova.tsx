import * as THREE from "three";
import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Separator, Highlight } from "../../../../ui/tooltip/styles";

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

	tooltip = () => (
		<React.Fragment>
			<Header>Nova</Header>
			<Separator/>
			<Highlight>50</Highlight> mana
			<Separator/>

			Throw <Highlight>10</Highlight> orbs of green flame in a circle around you.
			Each orb explodes on impact for <Highlight>50</Highlight> damage in a <Highlight>3</Highlight> yard radius.
		</React.Fragment>
	);

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
