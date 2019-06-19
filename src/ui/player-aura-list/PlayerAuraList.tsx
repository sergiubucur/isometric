import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container } from "./styles";
import ITooltipService from "../tooltip/service/ITooltipService";
import AuraType from "../../entity/aura/AuraType";
import PlayerAura from "./PlayerAura";
import UIConstants from "../common/UIConstants";

type Props = {
	player: IPlayer,
	tooltipService: ITooltipService
};

type State = {
	auras: AuraType[];
};

export default class PlayerAuraList extends PureComponent<Props, State> {
	state: State = {
		auras: []
	};

	private _intervalId: number;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const { player } = this.props;
			const auras = Array.from(player.auras);

			if (!this.arrayEquals(auras, this.state.auras)) {
				this.setState({
					auras
				});
			}
		}, UIConstants.RefreshIntervalMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	private arrayEquals<T>(a: T[], b: T[]) {
		return a.length === b.length && a.every((x, i) => x === b[i]);
	}

	render() {
		const { auras } = this.state;

		return (
			<Container>
				{auras.map(x => <PlayerAura key={x} aura={x} tooltipService={this.props.tooltipService} />)}
			</Container>
		);
	}
}
