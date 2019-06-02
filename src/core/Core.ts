import ILogger from "../logger/ILogger";
import IAssetService from "../asset/IAssetService";
import CoreState from "./CoreState";

export default class Core {
	private readonly _logger: ILogger;
	private readonly _assetService: IAssetService;

	private _assets: object | null;
	private _state: CoreState;
	private _nextState: CoreState | null;

	constructor(logger: ILogger, assetService: IAssetService) {
		this._logger = logger;
		this._assetService = assetService;

		this._assets = null;
		this._state = CoreState.None;
		this._nextState = null;
	}

	start() {
		this.run();
		this._nextState = CoreState.Load;
	}

	private run() {
		requestAnimationFrame(() => this.run());

		this.update();
		this.draw();
	}

	private update() {
		this.handleStateChange();
		this._logger.update();

		switch (this._state) {
			case CoreState.None:
				break;

			case CoreState.Load:
				this._logger.log("Loading...");
				break;

			case CoreState.Init:
				this._logger.log("Initializing...");
				break;

			case CoreState.Run:
				break;
		}
	}

	private draw() {
		switch (this._state) {
			case CoreState.None:
			case CoreState.Load:
			case CoreState.Init:
				break;

			case CoreState.Run:
				break;
		}
	}

	private handleStateChange() {
		if (!this._nextState) {
			return;
		}

		if (this._nextState === CoreState.Load) {
			this.beforeLoad();
			this.load();

			this._state = this._nextState;
			this._nextState = null;
			return;
		}

		if (this._nextState === CoreState.Init) {
			this.beforeInit();
			this.init();

			this._state = this._nextState;
			this._nextState = null;
			return;
		}

		if (this._nextState === CoreState.Run) {
			this.beforeRun();

			this._state = this._nextState;
			this._nextState = null;
			return;
		}
	}

	private beforeLoad() {
	}

	private load() {
		this._assetService.loadAssets().then((assets) => {
			this.afterLoad(assets);
		});
	}

	private afterLoad(assets: object) {
		this._assets = assets;
		this._nextState = CoreState.Init;
	}

	private beforeInit() {
	}

	private init() {
		setTimeout(() => {
			this.afterInit();
		}, 1000);
	}

	private afterInit() {
		this._nextState = CoreState.Run;
	}

	private beforeRun() {
	}
}
