import IComponent from "../../../common/IComponent";
import AuraType from "../../aura/AuraType";
import IPlayer from "../IPlayer";

export default interface IPlayerAuraEngine extends IComponent {
	readonly auras: AuraType[];

	init(player: IPlayer): void;
	addAura(type: AuraType): void;
	removeAura(type: AuraType): void;
	hasAura(type: AuraType): boolean;
	clearAuras(): void;
}
