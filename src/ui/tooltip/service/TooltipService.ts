import ITooltipService from "./ITooltipService";
import ITooltipConnector from "./ITooltipConnector";

export default class TooltipService implements ITooltipService, ITooltipConnector {
	onShow: (content: React.FunctionComponent) => void;
	onHide: () => void;

	constructor() {
		this.onShow = () => {};
		this.onHide = () => {};
	}

	show(content: React.FunctionComponent) {
		this.onShow(content);
	}

	hide() {
		this.onHide();
	}
}
