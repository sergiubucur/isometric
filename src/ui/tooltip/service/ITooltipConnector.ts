import ISpell from "../../../entity/player/spell-engine/ISpell";

export default interface ITooltipConnector {
	onShow: (spell: ISpell) => void;
	onHide: () => void;
}
