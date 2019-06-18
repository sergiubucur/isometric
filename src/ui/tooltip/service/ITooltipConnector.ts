import React from "react";

export default interface ITooltipConnector {
	onShow: (content: React.FunctionComponent) => void;
	onHide: () => void;
}
