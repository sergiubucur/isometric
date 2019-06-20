import ITooltipService from "./ITooltipService";
import ITooltipConnector from "./ITooltipConnector";

export default class TooltipService implements ITooltipService, ITooltipConnector {
	onShow: (content: React.FunctionComponent) => void;
	onHide: () => void;

	current: React.FunctionComponent;

	constructor() {
		this.onShow = () => {};
		this.onHide = () => {};

		this.current = null;
	}

	show(content: React.FunctionComponent) {
		this.current = content;
		this.onShow(content);
	}

	hide() {
		this.current = null;
		this.onHide();
	}
}
