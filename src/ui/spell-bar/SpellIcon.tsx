import React, { Component } from "react";

import SpellKeybindAssignment from "../../entity/player/spell-engine/SpellKeybindAssignment";
import { iconStyles, iconCooldownOverlayStyles, iconInnerStyles, iconBadgeStyles } from "./styles";
import { KeybindNames } from "../../input-tracker/Keybinds";

type Props = {
	data: SpellKeybindAssignment,
	active: boolean,
	cooldown: number,
	translucent: boolean
};

export default class SpellIcon extends Component<Props> {
	render() {
		const { data, active, cooldown, translucent } = this.props;

		return (
			<div style={iconStyles(active, translucent)}>
				<div style={iconBadgeStyles}>
					{KeybindNames[data.keybind]}
				</div>
				<div style={iconInnerStyles}>
					{data.spell.name[0]}
				</div>
				{cooldown > 0 && <div style={iconCooldownOverlayStyles(cooldown)}></div>}
			</div>
		);
	}
}
