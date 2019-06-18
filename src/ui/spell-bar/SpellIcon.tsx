import React, { Component } from "react";

import SpellKeybindAssignment from "../../entity/player/spell-engine/SpellKeybindAssignment";
import { IconContainer, IconInner, IconBadge, IconCooldownOverlay, ButtonSize, IconOuter } from "./styles";
import { KeybindNames } from "../../input-tracker/Keybinds";
import Icon from "../common/Icon";
import { GlobalCooldownTotalFrames } from "../../entity/player/spell-engine/PlayerSpellEngine";
import ITooltipService from "../tooltip/service/ITooltipService";

type Props = {
	data: SpellKeybindAssignment,
	active: boolean,
	cooldown: number,
	unusable: boolean,
	tooltipService: ITooltipService
};

export default class SpellIcon extends Component<Props> {
	handleMouseEnter = () => {
		const { tooltipService, data } = this.props;

		tooltipService.show(data.spell);
	};

	handleMouseLeave = () => {
		const { tooltipService } = this.props;

		tooltipService.hide();
	};

	render() {
		const { data, active, cooldown, unusable } = this.props;

		return (
			<IconOuter>
				<IconBadge>
					{KeybindNames[data.keybind]}
				</IconBadge>

				<IconContainer
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}

					style={{
						outline: active ? "2px solid #fff" : "2px solid #000",
						filter: unusable ? "brightness(0.25)" : "none"
					}}>

					<IconInner>
						<Icon name={data.spell.iconName} flip={data.spell.flipIcon}></Icon>
					</IconInner>

					{cooldown > 0 &&
						<IconCooldownOverlay
							style={{ height: `${Math.floor((cooldown / GlobalCooldownTotalFrames) * ButtonSize)}px` }} />
					}

				</IconContainer>
			</IconOuter>
		);
	}
}
