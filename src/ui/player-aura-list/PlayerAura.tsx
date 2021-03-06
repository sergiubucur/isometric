import React, { Component } from "react";

import Icon from "../common/Icon";
import ITooltipService from "../tooltip/service/ITooltipService";
import { IconContainer, StackValue } from "./styles";
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

	componentWillUnmount() {
		const { tooltipService, aura } = this.props;

		if (tooltipService.current === aura.tooltip) {
			tooltipService.hide();
		}
	}

	render() {
		const { aura } = this.props;
		const { iconName, flipIcon } = aura;

		return (
			<IconContainer
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				flicker={aura.isTimeBased()}>

				<Icon name={iconName} flip={flipIcon}/>
				{aura.maxStacks > 1 && <StackValue>{aura.stacks}</StackValue>}
			</IconContainer>
		);
	}
}
