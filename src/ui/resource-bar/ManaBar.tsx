import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { containerStyles, valueStyles, textStyles } from "./styles";

interface State {
	mana: number,
	totalMana: number
}

interface Props {
	player: IPlayer
}

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

		return (
			<React.Fragment>
				<div style={textStyles("right")}>
					{mana.toFixed(0)} / {totalMana.toFixed(0)}
				</div>
				<div style={containerStyles(ForegroundColor, BackgroundColor, "right")}>
					<div style={valueStyles(mana, totalMana, ForegroundColor)}></div>
				</div>
			</React.Fragment>
		);
	}
}
