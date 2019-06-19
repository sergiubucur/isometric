import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container, Text, Value, Margin, Width, BottomRightPadding } from "./styles";
import UIConstants from "../common/UIConstants";

interface State {
	mana: number,
	totalMana: number
}

interface Props {
	player: IPlayer
}

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
		}, UIConstants.RefreshIntervalMs);
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

				<Container style={{ right: Margin, border: `2px solid ${UIConstants.ManaLightColor}`, background: UIConstants.ManaDarkColor }}>

					<Value style={{
						width: Math.floor((mana / totalMana) * (Width - BottomRightPadding)),
						background: UIConstants.ManaLightColor
					}} />

				</Container>
			</React.Fragment>
		);
	}
}
