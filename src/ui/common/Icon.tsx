import React from "react";
import "rpg-awesome/css/rpg-awesome.css";

import { IconContainer } from "./styles";

type Props = {
	name: string,
	flip?: boolean
};

const Icon: React.FunctionComponent<Props> = ({ name, flip }) => {
	return (
		<IconContainer flip={flip} className={`ra ${name}`}></IconContainer>
	);
};

Icon.defaultProps = {
	flip: false
};

export default Icon;
