import IComponent from "../../../common/IComponent";
import AuraType from "./AuraType";
import IPlayer from "../IPlayer";
import IAura from "./IAura";

export default interface IPlayerAuraEngine extends IComponent {
	readonly auras: IAura[];

	init(player: IPlayer): void;
	addAura(type: AuraType): void;
	removeAura(type: AuraType): void;
	hasAura(type: AuraType): boolean;
	clearAuras(): void;
}
