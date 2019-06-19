import React from "react";

import AuraType from "./AuraType";
import { Header, Separator } from "../../ui/tooltip/styles";

const AuraTooltip = {
	[AuraType.Cloaked]: () => (
		<React.Fragment>
			<Header>Cloaked</Header>
			<Separator/>

			Invisible to enemies.
		</React.Fragment>
	),

	[AuraType.HealthBoost]: () => (
		<React.Fragment>
			<Header>Health Boost</Header>
			<Separator/>

			Gaining health over time.
		</React.Fragment>
	),

	[AuraType.ManaBoost]: () => (
		<React.Fragment>
			<Header>Mana Boost</Header>
			<Separator/>

			Gaining mana over time.
		</React.Fragment>
	)
}

export default AuraTooltip;
