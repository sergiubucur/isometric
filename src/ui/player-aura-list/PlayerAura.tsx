import React, { Component } from "react";

import Icon from "../common/Icon";
import ITooltipService from "../tooltip/service/ITooltipService";
import AuraType from "../../entity/aura/AuraType";
import AuraTooltip from "../../entity/aura/AuraTooltip";
import AuraIcon from "../../entity/aura/AuraIcon";
import { IconContainer } from "./styles";

type Props = {
	aura: AuraType,
	tooltipService: ITooltipService
};

export default class SpellIcon extends Component<Props> {
	handleMouseEnter = () => {
		const { tooltipService, aura } = this.props;

		tooltipService.show(AuraTooltip[aura]);
	};

	handleMouseLeave = () => {
		const { tooltipService } = this.props;

		tooltipService.hide();
	};

	render() {
		const { aura } = this.props;
		const { iconName, flipIcon } = AuraIcon[aura];

		return (
			<IconContainer
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}>

				<Icon name={iconName} flip={flipIcon}/>
			</IconContainer>
		);
	}
}
