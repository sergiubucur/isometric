import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Separator } from "../../../../ui/tooltip/styles";
import { Highlight } from "../../../../ui/common/Highlight";
import IMonster, { isMonster } from "../../../monster/IMonster";

export default class TouchOfDeath extends BaseSpell {
	constructor() {
		super();

		this.name = "Touch of Death";
		this.manaCost = 100;
		this.iconName = "ra-hand";
	}

	cast() {
		(this._player.mouseOverTarget as IMonster).damage();
	}

	condition() {
		const target = this._player.mouseOverTarget;

		return target && isMonster(target) && !target.dead;
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
