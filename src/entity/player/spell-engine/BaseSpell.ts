import IPlayer from "../IPlayer";
import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";
import IMouseControls from "../mouse-controls/IMouseControls";
import IWorld from "../../../world/IWorld";
import ISpell from "./ISpell";

export default abstract class BaseSpell implements ISpell {
	name: string;
	manaCost: number;
	uncloakOnCast: boolean;

	protected _world: IWorld;
	protected _player: IPlayer;
	protected _movementEngine: IEntityMovementEngine;
	protected _mouseControls: IMouseControls;

	constructor() {
		this.name = "BaseSpell";
		this.manaCost = 0;
		this.uncloakOnCast = true;
	}

	init(world: IWorld, player: IPlayer, movementEngine: IEntityMovementEngine, mouseControls: IMouseControls) {
		this._world = world;
		this._player = player;
		this._movementEngine = movementEngine;
		this._mouseControls = mouseControls;
	}

	condition() {
		return true;
	}

	abstract cast(): void;
}
