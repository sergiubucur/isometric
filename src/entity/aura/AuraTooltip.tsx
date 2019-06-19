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
	)
}

export default AuraTooltip;
