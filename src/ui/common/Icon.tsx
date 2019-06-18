import React from "react";
import "rpg-awesome/scss/rpg-awesome.scss";

type Props = {
	name: string,
	flip?: boolean
};

const Icon: React.FunctionComponent<Props> = ({ name, flip }) => {
	return (
		<i style={{ transform: flip ? "rotateY(180deg)" : "none" }} className={`ra ${name}`}></i>
	);
};

Icon.defaultProps = {
	flip: false
};

export default Icon;
