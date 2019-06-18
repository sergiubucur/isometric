import IPlayerUseEngine from "./IPlayerUseEngine";
import IUsable, { isUsable } from "../../IUsable";
import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";

export default class PlayerUseEngine implements IPlayerUseEngine {
	private _movementEngine: IEntityMovementEngine;
	private _highlightTarget: IUsable | null;
	private _willUse: IUsable | null;

	constructor() {
		this._highlightTarget = null;
		this._willUse = null;
	}

	init(movementEngine: IEntityMovementEngine) {
		this._movementEngine = movementEngine;
	}

	afterPositionUpdate() {
		if (this._willUse && this._willUse.canUse(this._movementEngine.position)) {
			this._willUse.use();
			this._willUse = null;
			this._movementEngine.stop();
		}
	}

	afterMouseOverTargetUpdate(mouseOverTarget: object) {
		if (!mouseOverTarget) {
			if (this._highlightTarget) {
				this._highlightTarget.setHighlight(false);
				this._highlightTarget = null;
			}

			return;
		}

		if (this._highlightTarget === mouseOverTarget) {
			if (!this._highlightTarget.canHighlight()) {
				this._highlightTarget.setHighlight(false);
				this._highlightTarget = null;
			}

			return;
		}

		if (isUsable(mouseOverTarget) && mouseOverTarget.canHighlight()) {
			if (this._highlightTarget) {
				this._highlightTarget.setHighlight(false);
			} else {
				this._highlightTarget = mouseOverTarget;
				this._highlightTarget.setHighlight(true);
			}
		}
	}

	onLeftClick(mouseOverTarget: object) {
		if (mouseOverTarget && isUsable(mouseOverTarget)) {
			this._willUse = mouseOverTarget;
		} else {
			this._willUse = null;
		}
	}
}
