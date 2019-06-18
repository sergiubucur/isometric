import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container, Text, Value } from "./styles";
import { Margin, Width } from "./styles";

interface State {
	health: number,
	totalHealth: number
}

interface Props {
	player: IPlayer
}

const RefreshIntervalMs = 33;
const ForegroundColor = "#c02020";
const BackgroundColor = "#400000";

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
		}, RefreshIntervalMs);
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

				<Container style={{ left: Margin, border: `2px solid ${ForegroundColor}`, background: BackgroundColor }}>

					<Value style={{
						width: `${Math.max(Math.floor((health / totalHealth) * Width) - 10, 0)}px`,
						background: ForegroundColor
					}} />

				</Container>
			</React.Fragment>
		);
	}
}
