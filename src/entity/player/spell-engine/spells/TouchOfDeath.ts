import BaseSpell from "../BaseSpell";

export default class TouchOfDeath extends BaseSpell {
	constructor() {
		super();

		this.name = "Touch of Death";
		this.manaCost = 100;
	}

	cast() {
		this._player.mouseOverTarget.damage();
	}

	condition() {
		return this._player.mouseOverTarget && !this._player.mouseOverTarget.dead;
	}
}
