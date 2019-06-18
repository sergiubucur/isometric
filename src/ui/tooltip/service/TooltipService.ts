import ITooltipService from "./ITooltipService";
import ITooltipConnector from "./ITooltipConnector";
import ISpell from "../../../entity/player/spell-engine/ISpell";

export default class TooltipService implements ITooltipService, ITooltipConnector {
	onShow: (spell: ISpell) => void;
	onHide: () => void;

	constructor() {
		this.onShow = () => {};
		this.onHide = () => {};
	}

	show(spell: ISpell) {
		this.onShow(spell);
	}

	hide() {
		this.onHide();
	}
}
