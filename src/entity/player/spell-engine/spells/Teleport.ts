import BaseSpell from "../BaseSpell";

export default class Teleport extends BaseSpell {
	constructor() {
		super();

		this.name = "Teleport";
		this.manaCost = 5;
	}

	cast() {
		if (this._movementEngine.canMoveTo(this._mouseControls.mousePosition)) {
			this._movementEngine.velocity.copy(this._mouseControls.mousePosition).sub(this._movementEngine.position);
			this._movementEngine.moveTo(this._mouseControls.mousePosition);
		}
	}
}
