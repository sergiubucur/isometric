import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container } from "./styles";
import ITooltipService from "../tooltip/service/ITooltipService";
import PlayerAura from "./PlayerAura";
import UIConstants from "../common/UIConstants";
import IAura from "../../entity/player/aura-engine/IAura";

type Props = {
	player: IPlayer,
	tooltipService: ITooltipService
};

type State = {
	auras: IAura[];
	stacks: number[];
};

export default class PlayerAuraList extends PureComponent<Props, State> {
	state: State = {
		auras: [],
		stacks: []
	};

	private _intervalId: number;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const { player } = this.props;
			const { auras } = player.auraEngine;

			if (this.needsUpdate(auras)) {
				this.setState({
					auras,
					stacks: auras.map(x => x.stacks)
				});
			}
		}, UIConstants.RefreshIntervalMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	private needsUpdate(auras: IAura[]) {
		return auras.length !== this.state.auras.length
			|| auras.find((x, i) => x !== this.state.auras[i] || x.stacks !== this.state.stacks[i]);
	}

	render() {
		const { auras } = this.state;

		console.log("render");

		return (
			<Container>
				{auras.map((x, i) => <PlayerAura key={i} aura={x} tooltipService={this.props.tooltipService} />)}
			</Container>
		);
	}
}
