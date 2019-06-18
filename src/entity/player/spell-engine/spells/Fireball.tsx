import * as THREE from "three";
import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Separator } from "../../../../ui/tooltip/styles";
import { Highlight } from "../../../../ui/common/Highlight";

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

	tooltip = () => (
		<React.Fragment>
			<Header>Fireball</Header>
			<Separator/>
			<Highlight>10</Highlight> mana
			<Separator/>

			Throw an orb of green flame.
			Explodes on impact for <Highlight>50</Highlight> damage in a <Highlight>3</Highlight> yard radius.
		</React.Fragment>
	);

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
