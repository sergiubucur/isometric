import IAssetService from "../asset/IAssetService";
import CoreState from "./CoreState";

export default class Core {
	private readonly _assetService : IAssetService;

	private _assets : object | null;
	private _state : CoreState;
	private _nextState : CoreState | null;

	constructor(assetService : IAssetService) {
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

		switch (this._state) {
			case CoreState.None:
			case CoreState.Load:
			case CoreState.Init:
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
		const div = document.createElement("div");
		div.id = "load";
		div.innerHTML = "Loading...";

		document.body.appendChild(div);
	}

	private load() {
		this._assetService.loadAssets().then((assets) => {
			this.afterLoad(assets);
		});
	}

	private afterLoad(assets : object) {
		this._assets = assets;
		this._nextState = CoreState.Init;
	}

	private beforeInit() {
		const loadDiv = document.getElementById("load");

		if (loadDiv) {
			document.body.removeChild(loadDiv);
		}

		const initDiv = document.createElement("div");
		initDiv.id = "init";
		initDiv.innerHTML = "Initializing...";

		document.body.appendChild(initDiv);
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
		const div = document.getElementById("init");

		if (div) {
			document.body.removeChild(div);
		}
	}
}
