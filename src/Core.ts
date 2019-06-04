import ILogger from "./logger/ILogger";
import IAssetService from "./asset/IAssetService";
import IComponent from "./common/IComponent";
import ICamera from "./camera/ICamera";
import Camera from "./camera/Camera";
import IRenderer from "./renderer/IRenderer";
import Renderer from "./renderer/Renderer";
import IWorldComponent from "./world/IWorldComponent";
import IWorld from "./world/IWorld";
import World from "./world/World";
import CoreState from "./CoreState";
import IInputTracker from "./input-tracker/IInputTracker";
import MouseControls from "./camera/MouseControls";

export default class Core {
	private readonly _logger: ILogger;
	private readonly _assetService: IAssetService;
	private readonly _inputTracker: IInputTracker;

	private _assets: object | null;
	private _state: CoreState;
	private _nextState: CoreState | null;
	private _camera: ICamera | null;
	private _world: IWorldComponent | null;
	private _renderer: IRenderer | null;
	private _cameraControls: IComponent | null;

	constructor(logger: ILogger, assetService: IAssetService, inputTracker: IInputTracker) {
		this._logger = logger;
		this._assetService = assetService;
		this._inputTracker = inputTracker;

		this._assets = null;
		this._state = CoreState.None;
		this._nextState = null;
		this._camera = null;
		this._world = null;
		this._renderer = null;
		this._cameraControls = null;

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
				this._world.update();
				this._cameraControls.update();
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
				this._renderer.render(this._world.scene, this._camera.camera);
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
		this._world = new World();
		this._renderer = new Renderer();

		this._world.init().then(() => {
			this._cameraControls = new MouseControls(this._camera, this._inputTracker, this._world as unknown as IWorld, this._logger);
			this._nextState = CoreState.Run;
		});
	}
}
