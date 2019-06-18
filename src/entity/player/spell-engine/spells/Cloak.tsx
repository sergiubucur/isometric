import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Separator } from "../../../../ui/tooltip/styles";

export default class Cloak extends BaseSpell {
	constructor() {
		super();

		this.name = "Cloak";
		this.uncloakOnCast = false;
		this.iconName = "ra-hood";
	}

	cast() {
		this._player.setInvisibility(!this._player.invisible);
	}

	tooltip = () => (
		<React.Fragment>
			<Header>Cloak</Header>
			<Separator/>

			Turn invisible to enemies. Casting this or any spell will uncloak you.
		</React.Fragment>
	);
}
