import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";

interface State {
	mana: number,
	totalMana: number
}

interface Props {
	player: IPlayer
}

const Margin = 32;
const Width = 256;
const Height = 32;
const RefreshIntervalMs = 33;
const ForegroundColor = "#2080c0";
const BackgroundColor = "#002040";

export default class ManaBar extends PureComponent<Props, State> {
	state = {
		mana: 100,
		totalMana: 100
	};

	private _intervalId: NodeJS.Timeout;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const { player } = this.props;

			this.setState({
				mana: player.mana,
				totalMana: player.totalMana
			});
		}, RefreshIntervalMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	render() {
		const { mana, totalMana } = this.state;

		const textStyles: any = {
			position: "fixed",
			right: Margin,
			bottom: Margin + Height + Margin / 2,
			fontSize: 22,
			color: "#fff",
			textShadow: "2px 2px 0px #000",
			userSelect: "none"
		};

		const containerStyles: any = {
			position: "fixed",
			right: Margin,
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
			width: Math.floor((mana / totalMana) * Width),
			height: Height,
			background: ForegroundColor
		};

		return (
			<React.Fragment>
				<div style={textStyles}>
					{mana.toFixed(0)} / {totalMana.toFixed(0)}
				</div>
				<div style={containerStyles}>
					<div style={valueStyles}></div>
				</div>
			</React.Fragment>
		);
	}
}
