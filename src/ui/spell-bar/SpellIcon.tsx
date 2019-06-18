import React, { Component } from "react";

import SpellKeybindAssignment from "../../entity/player/spell-engine/SpellKeybindAssignment";
import { IconContainer, IconInner, IconBadge, IconCooldownOverlay } from "./styles";
import { KeybindNames } from "../../input-tracker/Keybinds";
import Icon from "../common/Icon";

type Props = {
	data: SpellKeybindAssignment,
	active: boolean,
	cooldown: number,
	unusable: boolean
};

export default class SpellIcon extends Component<Props> {
	render() {
		const { data, active, cooldown, unusable } = this.props;

		return (
			<IconContainer active={active} unusable={unusable}>
				<IconBadge>
					{KeybindNames[data.keybind]}
				</IconBadge>
				<IconInner>
					<Icon name={data.spell.iconName} flip={data.spell.flipIcon}></Icon>
				</IconInner>
				{cooldown > 0 && <IconCooldownOverlay cooldown={cooldown}/>}
			</IconContainer>
		);
	}
}
