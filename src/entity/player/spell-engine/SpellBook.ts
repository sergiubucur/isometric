import Keybinds from "../../../input-tracker/Keybinds";
import Teleport from "./spell/Teleport";
import Cloak from "./spell/Cloak";
import TouchOfDeath from "./spell/TouchOfDeath";
import Nova from "./spell/Nova";
import Fireball from "./spell/Fireball";

export default function getSpells() {
	return [
		{ keybind: Keybinds.D1, spell: new Cloak() },
		{ keybind: Keybinds.D2, spell: new Nova() },
		{ keybind: Keybinds.D3, spell: new TouchOfDeath() },
		{ keybind: Keybinds.D4, spell: new Teleport() },
		{ keybind: Keybinds.RightMouseButton, spell: new Fireball() }
	];
}
