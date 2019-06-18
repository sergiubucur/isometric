import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Separator, Highlight } from "../../../../ui/tooltip/styles";

export default class TouchOfDeath extends BaseSpell {
	constructor() {
		super();

		this.name = "Touch of Death";
		this.manaCost = 100;
		this.iconName = "ra-hand";
	}

	cast() {
		this._player.mouseOverTarget.damage();
	}

	condition() {
		return this._player.mouseOverTarget && !this._player.mouseOverTarget.dead;
	}

	tooltip = () => (
		<React.Fragment>
			<Header>Touch of Death</Header>
			<Separator/>
			<Highlight>100</Highlight> mana
			<Separator/>

			Instantly kill an enemy.
		</React.Fragment>
	);
}
