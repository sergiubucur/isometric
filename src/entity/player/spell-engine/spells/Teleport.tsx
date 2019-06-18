import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Highlight, Separator } from "../../../../ui/tooltip/styles";

export default class Teleport extends BaseSpell {
	constructor() {
		super();

		this.name = "Teleport";
		this.manaCost = 5;
		this.iconName = "ra-player-teleport";
	}

	cast() {
		if (this._movementEngine.canMoveTo(this._mouseControls.mousePosition)) {
			this._movementEngine.velocity.copy(this._mouseControls.mousePosition).sub(this._movementEngine.position);
			this._movementEngine.moveTo(this._mouseControls.mousePosition);
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
