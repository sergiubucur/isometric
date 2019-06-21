import React, { PureComponent } from "react";

import { Container } from "./styles";
import ITooltipConnector from "./service/ITooltipConnector";

type Props = {
	connector: ITooltipConnector
};

type State = {
	content: React.FunctionComponent
};

export default class Tooltip extends PureComponent<Props, State> {
	state: State = {
		content: null
	};

	componentDidMount() {
		this.props.connector.onShow = (content: React.FunctionComponent) => {
			this.setState({ content });
		};

		this.props.connector.onHide = () => {
			this.setState({ content: null });
		};
	}

	componentWillUnmount() {
		this.props.connector.onShow = () => {};
		this.props.connector.onHide = () => {};
	}

	render() {
		if (!this.state.content) {
			return null;
		}

		return (
			<Container>
				<this.state.content />
			</Container>
		);
	}
}
