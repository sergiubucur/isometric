import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container, Text, Value, Margin, Width } from "./styles";

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

	private _intervalId: number;

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
				<Text style={{ right: Margin }}>
					{mana.toFixed(0)} / {totalMana.toFixed(0)}
				</Text>

				<Container style={{ right: Margin, border: `2px solid ${ForegroundColor}`, background: BackgroundColor }}>

					<Value style={{
						width: `${Math.max(Math.floor((mana / totalMana) * Width) - 10, 0)}px`,
						background: ForegroundColor
					}} />

				</Container>
			</React.Fragment>
		);
	}
}
