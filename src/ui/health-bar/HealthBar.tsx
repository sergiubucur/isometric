import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";

interface State {
	health: number,
	totalHealth: number
}

interface Props {
	player: IPlayer
}

const Margin = 32;
const Width = 256;
const Height = 32;
const RefreshIntervalMs = 33;
const ForegroundColor = "#E01A1B";
const BackgroundColor = "#3A0708";

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

		const textStyles: any = {
			position: "fixed",
			left: Margin,
			bottom: Margin + Height + Margin / 2,
			fontSize: 22,
			color: "#fff",
			textShadow: "2px 2px 0px #000",
			userSelect: "none"
		};

		const containerStyles: any = {
			position: "fixed",
			left: Margin,
			bottom: Margin,
			width: Width,
			height: Height,
			border: `2px solid ${ForegroundColor}`,
			outline: "2px solid #000",
			background: BackgroundColor,
			userSelect: "none",
			boxSizing: "border-box",
			overflow: "hidden"
		};

		const valueStyles: any = {
			width: Math.floor((health / totalHealth) * Width),
			height: Height,
			background: ForegroundColor
		};

		return (
			<React.Fragment>
				<div style={textStyles}>
					{health} / {totalHealth}
				</div>
				<div style={containerStyles}>
					<div style={valueStyles}></div>
				</div>
			</React.Fragment>
		);
	}
}
