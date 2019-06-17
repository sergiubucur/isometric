import IPlayerSpellEngine from "./IPlayerSpellEngine";
import IPlayer from "../IPlayer";
import IMouseControls from "../mouse-controls/IMouseControls";
import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";
import IWorld from "../../../world/IWorld";
import IInputTracker from "../../../input-tracker/IInputTracker";
import Keybinds from "../../../input-tracker/Keybinds";
import SpellKeybindAssignment from "./SpellKeybindAssignment";
import getSpells from "./SpellBook";

export const GlobalCooldown = 17;

export default class PlayerSpellEngine implements IPlayerSpellEngine {
	activeSpell: SpellKeybindAssignment | null;
	spells: SpellKeybindAssignment[];
	globalCooldown: number;

	private _player: IPlayer;
	private _movementEngine: IEntityMovementEngine;
	private _mouseControls: IMouseControls;
	private _rightMouseDown: boolean;

	constructor(private _world: IWorld, private _inputTracker: IInputTracker) {
		this.activeSpell = null;
		this.globalCooldown = 0;
	}

	init(player: IPlayer, movementEngine: IEntityMovementEngine, mouseControls: IMouseControls) {
		this._player = player;
		this._movementEngine = movementEngine;

		this._mouseControls = mouseControls;
		this._mouseControls.onRightClick = () => this._rightMouseDown = true;

		this.initSpells();
	}

	initSpells() {
		this.spells = getSpells();

		this.spells.forEach(x => {
			x.spell.init(this._world, this._player, this._movementEngine, this._mouseControls);
		});
	}

	update() {
		if (this.globalCooldown > 0) {
			this.globalCooldown--;
			this._rightMouseDown = false;

			if (this.globalCooldown === 0) {
				this.activeSpell = null;
			}
			return;
		}

		for (let i = 0; i < this.spells.length; i++) {
			const { keybind, spell } = this.spells[i];

			if ((keybind === Keybinds.RightMouseButton && this._rightMouseDown) || this._inputTracker.keysPressed[keybind]) {
				if (this._player.mana >= spell.manaCost && spell.condition()) {
					this._movementEngine.stop();
					this.globalCooldown = GlobalCooldown;
					this._player.spendMana(spell.manaCost);

					if (spell.uncloakOnCast) {
						this._player.setInvisibility(false);
					}

					spell.cast();
					this.activeSpell = this.spells[i];
				}

				break;
			}
		}

		this._rightMouseDown = false;
	}
}
