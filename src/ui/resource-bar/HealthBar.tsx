import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container, Text, Value } from "./styles";

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
				<Text side="left">
					{health.toFixed(0)} / {totalHealth.toFixed(0)}
				</Text>
				<Container foregroundColor={ForegroundColor} backgroundColor={BackgroundColor} side="left">
					<Value value={health} total={totalHealth} foregroundColor={ForegroundColor} />
				</Container>
			</React.Fragment>
		);
	}
}
