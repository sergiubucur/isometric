import React, { PureComponent } from "react";

import { Container } from "./styles";
import ITooltipConnector from "./service/ITooltipConnector";
import ISpell from "../../entity/player/spell-engine/ISpell";

type Props = {
	connector: ITooltipConnector
};

type State = {
	spell: ISpell | null
};

export default class Tooltip extends PureComponent<Props, State> {
	state: State = {
		spell: null
	};

	componentDidMount() {
		this.props.connector.onShow = (spell: ISpell) => {
			this.setState({ spell });
		};

		this.props.connector.onHide = () => {
			this.setState({ spell: null });
		};
	}

	componentWillUnmount() {
		this.props.connector.onShow = () => {};
		this.props.connector.onHide = () => {};
	}

	render() {
		const { spell } = this.state;

		if (!spell) {
			return null;
		}

		return (
			<Container>
				<spell.tooltip />
			</Container>
		);
	}
}
