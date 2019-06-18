import React, { Component } from "react";

import SpellKeybindAssignment from "../../entity/player/spell-engine/SpellKeybindAssignment";
import { iconStyles, iconCooldownOverlayStyles, iconInnerStyles, iconBadgeStyles } from "./styles";
import { KeybindNames } from "../../input-tracker/Keybinds";
import Icon from "../common/Icon";

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
					<Icon name={data.spell.iconName} flip={data.spell.flipIcon}></Icon>
				</div>
				{cooldown > 0 && <div style={iconCooldownOverlayStyles(cooldown)}></div>}
			</div>
		);
	}
}
