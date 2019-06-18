import BaseSpell from "../BaseSpell";

export default class Cloak extends BaseSpell {
	constructor() {
		super();

		this.name = "Cloak";
		this.uncloakOnCast = false;
		this.iconName = "ra-hood";
	}

	cast() {
		this._player.setInvisibility(!this._player.invisible);
	}
}
