import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Separator } from "../../../../ui/tooltip/styles";
import { Highlight } from "../../../../ui/common/Highlight";

export default class Teleport extends BaseSpell {
	constructor() {
		super();

		this.name = "Teleport";
		this.manaCost = 5;
		this.iconName = "ra-player-teleport";
	}

	cast() {
		if (this._movementEngine.canMoveTo(this._mouseControls.mapPosition)) {
			this._movementEngine.velocity.copy(this._mouseControls.mapPosition).sub(this._movementEngine.position);
			this._movementEngine.moveTo(this._mouseControls.mapPosition);
		}
	}

	tooltip = () => (
		<React.Fragment>
			<Header>Teleport</Header>
			<Separator/>
			<Highlight>5</Highlight> mana
			<Separator/>

			Teleport to a chosen nearby location.
		</React.Fragment>
	);
}
