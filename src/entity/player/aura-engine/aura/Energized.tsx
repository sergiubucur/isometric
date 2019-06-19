import React from "react";

import BaseAura from "../BaseAura";
import { Header, Separator } from "../../../../ui/tooltip/styles";
import { secondsToTicks } from "../AuraTick";

export default class Energized extends BaseAura {
	constructor() {
		super();

		this.name = "Energized";
		this.iconName = "ra-lightning-bolt";
		this.totalTicks = secondsToTicks(5);
		this.maxStacks = 20;
	}

	tick() {
		super.tick();

		this._player.gainHealth(this.stacks / 20);
		this._player.gainMana(this.stacks / 10);
	}

	tooltip = () => (
		<React.Fragment>
			<Header>Energized</Header>
			<Separator/>

			Gaining health and mana over time. Can stack.
		</React.Fragment>
	);
}
