import IFpsDisplay from "./IFpsDisplay";
import ILogger from "../logger/ILogger";

export default class FpsDisplay implements IFpsDisplay {
	private _visible: boolean;
	private _time: number;
	private _frames: number;

	constructor(private _logger: ILogger) {
		this._visible = false;
		this._time = performance.now();
		this._frames = 0;
	}

	afterFrame() {
		this._frames++;

		const time = performance.now();
		if (time - this._time > 1000) {
			if (this._visible) {
				this._logger.logBounds("fps", this._frames, 0);
			}

			this._time = time;
			this._frames = 0;
		}
	}

	hide() {
		this._visible = false;
	}

	show() {
		this._visible = true;
	}
}
