import ISpell from "../../../entity/player/spell-engine/ISpell";

export default interface ITooltipService {
	show(spell: ISpell): void;
	hide(): void;
}
