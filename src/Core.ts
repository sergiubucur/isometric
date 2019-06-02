import ILogger from "./logger/ILogger";
import IAssetService from "./asset/IAssetService";
import ICamera from "./camera/ICamera";
import Camera from "./camera/Camera";
import IRenderer from "./renderer/IRenderer";
import Renderer from "./renderer/Renderer";
import IScene from "./scene/IScene";
import Scene from "./scene/Scene";
import CoreState from "./CoreState";
import IInputTracker from "./input-tracker/IInputTracker";
import ITankControls from "./camera/ITankControls";
import TankControls from "./camera/TankControls";

export default class Core {
	private readonly _logger: ILogger;
	private readonly _assetService: IAssetService;
	private readonly _inputTracker: IInputTracker;

	private _assets: object | null;
	private _state: CoreState;
	private _nextState: CoreState | null;
	private _camera: ICamera | null;
	private _scene: IScene | null;
	private _renderer: IRenderer | null;
	private _tankControls: ITankControls | null;

	constructor(logger: ILogger, assetService: IAssetService, inputTracker: IInputTracker) {
		this._logger = logger;
		this._assetService = assetService;
		this._inputTracker = inputTracker;

		this._assets = null;
		this._state = CoreState.None;
		this._nextState = null;
		this._camera = null;
		this._scene = null;
		this._renderer = null;
		this._tankControls = null;

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
				break;

			case CoreState.Load:
				this._logger.log("Loading...");
				break;

			case CoreState.Init:
				this._logger.log("Initializing...");
				break;

			case CoreState.Run:
				this._scene.update();
				this._tankControls.update();
				break;
		}

		this._logger.update();
		this._inputTracker.update();
	}

	private draw() {
		switch (this._state) {
			case CoreState.None:
			case CoreState.Load:
			case CoreState.Init:
				break;

			case CoreState.Run:
				this._renderer.render(this._scene.scene, this._camera.camera);
				break;
		}
	}

	private handleStateChange() {
		if (!this._nextState) {
			return;
		}

		if (this._nextState === CoreState.Load) {
			this.load();

			this._state = this._nextState;
			this._nextState = null;
			return;
		}

		if (this._nextState === CoreState.Init) {
			this.init();

			this._state = this._nextState;
			this._nextState = null;
			return;
		}

		if (this._nextState === CoreState.Run) {
			this._state = this._nextState;
			this._nextState = null;
			return;
		}
	}

	private load() {
		this._assetService.loadAssets().then((assets) => {
			this._assets = assets;
			this._nextState = CoreState.Init;
		});
	}

	private init() {
		this._camera = new Camera();
		this._scene = new Scene();
		this._renderer = new Renderer();
		this._tankControls = new TankControls(this._camera, this._inputTracker, this._scene, this._logger);

		this._scene.init().then(() => {
			this._nextState = CoreState.Run;
		});
	}
}
