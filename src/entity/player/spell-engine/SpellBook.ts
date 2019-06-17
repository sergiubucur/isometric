import Keybinds from "../../../input-tracker/Keybinds";
import Teleport from "./spells/Teleport";
import Cloak from "./spells/Cloak";
import TouchOfDeath from "./spells/TouchOfDeath";
import Nova from "./spells/Nova";
import Fireball from "./spells/Fireball";

export default function getSpells() {
	return [
		{ keybind: Keybinds.RightMouseButton, spell: new Fireball() },
		{ keybind: Keybinds.D1, spell: new Cloak() },
		{ keybind: Keybinds.D2, spell: new TouchOfDeath() },
		{ keybind: Keybinds.D3, spell: new Nova() },
		{ keybind: Keybinds.D4, spell: new Teleport() }
	];
}
