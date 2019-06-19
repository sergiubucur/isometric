import React from "react";

import BaseSpell from "../BaseSpell";
import { Header, Separator } from "../../../../ui/tooltip/styles";
import AuraType from "../../../aura/AuraType";

export default class Cloak extends BaseSpell {
	constructor() {
		super();

		this.name = "Cloak";
		this.uncloakOnCast = false;
		this.iconName = "ra-hood";
	}

	cast() {
		const invisible = this._player.auraEngine.hasAura(AuraType.Cloaked);
		this._player.setInvisibility(!invisible);
	}

	tooltip = () => (
		<React.Fragment>
			<Header>Cloak</Header>
			<Separator/>

			Turn invisible to enemies. Casting this or any spell will uncloak you.
		</React.Fragment>
	);
}
