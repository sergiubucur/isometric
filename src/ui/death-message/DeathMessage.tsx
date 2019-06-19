import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { Container, Title } from "./styles";
import { Highlight } from "../common/Highlight";
import UIConstants from "../common/UIConstants";

interface State {
	visible: boolean
}

interface Props {
	player: IPlayer
}

export default class HealthBar extends PureComponent<Props, State> {
	state: State = {
		visible: false
	};

	private _intervalId: number;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const { player } = this.props;

			this.setState({
				visible: player.dead
			});
		}, UIConstants.RefreshIntervalMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	render() {
		const { visible } = this.state;

		if (!visible) {
			return null;
		}

		return (
			<Container>
				<Title>You died.</Title>
				Press <Highlight>Enter</Highlight> to resurrect.
			</Container>
		);
	}
}
