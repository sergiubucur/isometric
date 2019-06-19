import React, { Component } from "react";

import Icon from "../common/Icon";
import ITooltipService from "../tooltip/service/ITooltipService";
import { IconContainer } from "./styles";
import IAura from "../../entity/player/aura-engine/IAura";

type Props = {
	aura: IAura,
	tooltipService: ITooltipService
};

export default class SpellIcon extends Component<Props> {
	handleMouseEnter = () => {
		const { tooltipService, aura } = this.props;

		tooltipService.show(aura.tooltip);
	};

	handleMouseLeave = () => {
		const { tooltipService } = this.props;

		tooltipService.hide();
	};

	render() {
		const { aura } = this.props;
		const { iconName, flipIcon } = aura;

		return (
			<IconContainer
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>

				<Icon name={iconName} flip={flipIcon}/>
			</IconContainer>
		);
	}
}
