import React from "react";

import BaseAura from "../BaseAura";
import { Header, Separator } from "../../../../ui/tooltip/styles";

export default class Cloaked extends BaseAura {
	constructor() {
		super();

		this.name = "Cloaked";
		this.iconName = "ra-hood";
	}

	tick() {
	}

	tooltip = () => (
		<React.Fragment>
			<Header>Cloaked</Header>
			<Separator/>

			Invisible to enemies.
		</React.Fragment>
	);
}
