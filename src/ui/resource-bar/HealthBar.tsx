import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container, Text, Value, BottomRightPadding } from "./styles";
import { Margin, Width } from "./styles";
import UIConstants from "../common/UIConstants";

interface State {
	health: number,
	totalHealth: number
}

interface Props {
	player: IPlayer
}

export default class HealthBar extends PureComponent<Props, State> {
	state = {
		health: 100,
		totalHealth: 100
	};

	private _intervalId: number;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const { player } = this.props;

			this.setState({
				health: player.health,
				totalHealth: player.totalHealth
			});
		}, UIConstants.RefreshIntervalMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	render() {
		const { health, totalHealth } = this.state;

		return (
			<React.Fragment>
				<Text style={{ left: Margin }}>
					{health.toFixed(0)} / {totalHealth.toFixed(0)}
				</Text>

				<Container style={{ left: Margin, border: `2px solid ${UIConstants.HealthLightColor}`, background: UIConstants.HealthDarkColor }}>

					<Value style={{
						width: Math.floor((health / totalHealth) * (Width - BottomRightPadding)),
						background: UIConstants.HealthLightColor
					}} />

				</Container>
			</React.Fragment>
		);
	}
}
