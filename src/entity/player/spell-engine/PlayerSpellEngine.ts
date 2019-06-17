import IPlayerSpellEngine from "./IPlayerSpellEngine";
import IPlayer from "../IPlayer";
import IMouseControls from "../mouse-controls/IMouseControls";
import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";
import IWorld from "../../../world/IWorld";
import IInputTracker from "../../../input-tracker/IInputTracker";
import Keybinds from "../../../input-tracker/Keybinds";
import Fireball from "./spells/Fireball";
import SpellKeybindAssignment from "./SpellKeybindAssignment";
import Teleport from "./spells/Teleport";
import Cloak from "./spells/Cloak";
import TouchOfDeath from "./spells/TouchOfDeath";
import Nova from "./spells/Nova";

const SpellCooldown = 17;

export default class PlayerSpellEngine implements IPlayerSpellEngine {
	spells: SpellKeybindAssignment[];

	private _player: IPlayer;
	private _movementEngine: IEntityMovementEngine;
	private _mouseControls: IMouseControls;
	private _spellCooldown: number;
	private _rightMouseDown: boolean;

	constructor(private _world: IWorld, private _inputTracker: IInputTracker) {
		this._spellCooldown = 0;
	}

	init(player: IPlayer, movementEngine: IEntityMovementEngine, mouseControls: IMouseControls) {
		this._player = player;
		this._movementEngine = movementEngine;

		this._mouseControls = mouseControls;
		this._mouseControls.onRightClick = () => this._rightMouseDown = true;

		this.initSpells();
	}

	initSpells() {
		this.spells = [
			{ keybind: Keybinds.RightMouseButton, spell: new Fireball() },
			{ keybind: Keybinds.D1, spell: new Cloak() },
			{ keybind: Keybinds.D2, spell: new TouchOfDeath() },
			{ keybind: Keybinds.D3, spell: new Nova() },
			{ keybind: Keybinds.D4, spell: new Teleport() }
		];

		this.spells.forEach(x => {
			x.spell.init(this._world, this._player, this._movementEngine, this._mouseControls);
		});
	}

	update() {
		if (this._spellCooldown > 0) {
			this._spellCooldown--;
			this._rightMouseDown = false;
			return;
		}

		for (let i = 0; i < this.spells.length; i++) {
			const { keybind, spell } = this.spells[i];

			if ((keybind === Keybinds.RightMouseButton && this._rightMouseDown) || this._inputTracker.keysPressed[keybind]) {
				if (this._player.mana >= spell.manaCost && spell.condition()) {
					this._movementEngine.stop();
					this._spellCooldown = SpellCooldown;
					this._player.spendMana(spell.manaCost);

					if (spell.uncloakOnCast) {
						this._player.setInvisibility(false);
					}

					spell.cast();
				}

				break;
			}
		}

		this._rightMouseDown = false;
	}
}
