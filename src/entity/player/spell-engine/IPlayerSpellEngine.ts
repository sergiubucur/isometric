import IComponent from "../../../common/IComponent";
import IPlayer from "../IPlayer";
import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";
import IMouseControls from "../mouse-controls/IMouseControls";
import SpellKeybindAssignment from "./SpellKeybindAssignment";

export default interface IPlayerSpellEngine extends IComponent {
	readonly activeSpell: SpellKeybindAssignment;
	readonly spells: SpellKeybindAssignment[];
	readonly globalCooldown: number;

	init(player: IPlayer, movementEngine: IEntityMovementEngine, mouseControls: IMouseControls): void;
}
