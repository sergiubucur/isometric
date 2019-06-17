import IComponent from "../../../common/IComponent";
import IPlayer from "../IPlayer";
import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";
import IMouseControls from "../mouse-controls/IMouseControls";
import SpellKeybindAssignment from "./SpellKeybindAssignment";

export default interface IPlayerSpellEngine extends IComponent {
	init(player: IPlayer, movementEngine: IEntityMovementEngine, mouseControls: IMouseControls): void;

	readonly spells: SpellKeybindAssignment[];
}
