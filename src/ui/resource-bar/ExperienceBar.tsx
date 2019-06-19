import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container, Value, BottomRightPadding } from "./styles";

interface State {
	experience: number,
	experienceToNextLevel: number
}

interface Props {
	player: IPlayer
}

const RefreshIntervalMs = 33;
const ForegroundColor = "#c0c0c0";
const BackgroundColor = "#202020";
const Width = 272;
const Height = 16;

export default class HealthBar extends PureComponent<Props, State> {
	state = {
		experience: 0,
		experienceToNextLevel: 100
	};

	private _intervalId: number;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const { player } = this.props;

			this.setState({
				experience: player.experience,
				experienceToNextLevel: player.experienceToNextLevel
			});
		}, RefreshIntervalMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	render() {
		const { experience, experienceToNextLevel } = this.state;

		return (
			<React.Fragment>
				<Container
					style={{
						width: Width,
						height: Height,
						left: "50%",
						transform: "translateX(-50%)",
						border: `2px solid ${ForegroundColor}`,
						background: BackgroundColor
					}}>

					<Value style={{
						width: Math.floor((experience / experienceToNextLevel) * (Width - BottomRightPadding)),
						height: Height - BottomRightPadding,
						background: ForegroundColor
					}} />

				</Container>
			</React.Fragment>
		);
	}
}
