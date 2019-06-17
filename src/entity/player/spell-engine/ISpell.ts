import IPlayer from "../IPlayer";
import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";
import IMouseControls from "../mouse-controls/IMouseControls";
import IWorld from "../../../world/IWorld";

export default interface ISpell {
	readonly name: string;
	readonly manaCost: number;
	readonly uncloakOnCast: boolean;

	init(world: IWorld, player: IPlayer, movementEngine: IEntityMovementEngine, mouseControls: IMouseControls): void;
	cast(): void;
	condition(): boolean;
}
