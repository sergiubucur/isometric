import React from "react";

import BaseAura from "../BaseAura";
import { Header, Separator } from "../../../../ui/tooltip/styles";

export default class Energized extends BaseAura {
	constructor() {
		super();

		this.name = "Energized";
		this.iconName = "ra-lightning-bolt";
	}

	tick() {
		this._player.gainHealth(1);
		this._player.gainMana(1);
	}

	tooltip = () => (
		<React.Fragment>
			<Header>Energized</Header>
			<Separator/>

			Gaining health and mana over time.
		</React.Fragment>
	);
}
