import React, { Component } from "react";

import SpellKeybindAssignment from "../../entity/player/spell-engine/SpellKeybindAssignment";
import { IconContainer, IconInner, IconBadge, IconCooldownOverlay, ButtonSize } from "./styles";
import { KeybindNames } from "../../input-tracker/Keybinds";
import Icon from "../common/Icon";
import { GlobalCooldownTotalFrames } from "../../entity/player/spell-engine/PlayerSpellEngine";

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
			<IconContainer
				style={{
					outline: active ? "2px solid #fff" : "2px solid #000",
					filter: unusable ? "brightness(0.25)" : "none"
				}}>

				<IconBadge>
					{KeybindNames[data.keybind]}
				</IconBadge>

				<IconInner>
					<Icon name={data.spell.iconName} flip={data.spell.flipIcon}></Icon>
				</IconInner>

				{cooldown > 0 &&
					<IconCooldownOverlay
						style={{ height: `${Math.floor((cooldown / GlobalCooldownTotalFrames) * ButtonSize)}px` }}/>
				}

			</IconContainer>
		);
	}
}
