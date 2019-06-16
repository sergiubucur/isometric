import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { containerStyles, valueStyles, textStyles } from "./styles";

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

	private _intervalId: NodeJS.Timeout;

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
				<div style={textStyles("left")}>
					{health.toFixed(0)} / {totalHealth.toFixed(0)}
				</div>
				<div style={containerStyles(ForegroundColor, BackgroundColor, "left")}>
					<div style={valueStyles(health, totalHealth, ForegroundColor)}></div>
				</div>
			</React.Fragment>
		);
	}
}
