import ILogger from "./common/logger/ILogger";
import IAssetService from "./asset/IAssetService";
import ICamera from "./camera/ICamera";
import IRenderer from "./renderer/IRenderer";
import IWorldComponent from "./world/IWorldComponent";
import IWorld from "./world/IWorld";
import CoreState from "./CoreState";
import IInputTracker from "./input-tracker/IInputTracker";
import IPlayer from "./entity/player/IPlayer";
import IUIRoot from "./ui/IUIRoot";
import ICore from "./ICore";
import Keybinds from "./input-tracker/Keybinds";
import IFpsDisplay from "./common/fps-display/IFpsDisplay";

export default class Core implements ICore {
	onRestart: () => void;

	private _state: CoreState;
	private _nextState: CoreState | null;
	private _camera: ICamera | null;
	private _world: IWorld & IWorldComponent | null;
	private _renderer: IRenderer | null;
	private _uiRoot: IUIRoot | null;
	private _assetService: IAssetService;

	constructor(private _logger: ILogger,
		private _assetServiceFactory: () => IAssetService,
		private _inputTracker: IInputTracker,
		private _cameraFactory: () => ICamera,
		private _rendererFactory: () => IRenderer,
		private _worldFactory: () => IWorld & IWorldComponent,
		private _playerFactory: () => IPlayer,
		private _uiRootFactory: () => IUIRoot,
		private _fpsDisplay: IFpsDisplay) {

		this.onRestart = () => {};
		this._state = CoreState.None;
		this._nextState = null;
		this._camera = null;
		this._world = null;
		this._renderer = null;
		this._assetService = null;

		this.run();
		this._nextState = CoreState.Load;
	}

	private run() {
		requestAnimationFrame(() => this.run());

		this._fpsDisplay.beginFrame();

		this.update();
		this.draw();

		this._fpsDisplay.endFrame();
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
				const time = performance.now();

				this._world.update();

				this._logger.logBounds("update time", performance.now() - time);

				if (this._inputTracker.keysPressed[Keybinds.D4] && this._inputTracker.altKey && this._inputTracker.shiftKey) {
					this._nextState = CoreState.Restart;
				}
				break;

			case CoreState.Restart:
				this._logger.log("Restarting...");
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
			case CoreState.Restart:
				break;

			case CoreState.Run:
				const time = performance.now();

				this._renderer.render(this._world.scene, this._camera.camera);

				this._logger.logBounds("draw time", performance.now() - time);
				break;
		}
	}

	private handleStateChange() {
		if (!this._nextState) {
			return;
		}

		this._logger.clear();
		this._fpsDisplay.hide();

		if (this._nextState === CoreState.Load) {
			this.load();

			this._state = this._nextState;
			this._nextState = null;
			return;
		}

		if (this._nextState === CoreState.Init) {
			setTimeout(() => this.init());

			this._state = this._nextState;
			this._nextState = null;
			return;
		}

		if (this._nextState === CoreState.Run) {
			this._fpsDisplay.show();

			this._state = this._nextState;
			this._nextState = null;
			return;
		}

		if (this._nextState === CoreState.Restart) {
			setTimeout(() => this.restart());

			this._state = this._nextState;
			this._nextState = null;
			return;
		}
	}

	private load() {
		this._assetService = this._assetServiceFactory();

		this._assetService.loadAssets().then(() => {
			this._nextState = CoreState.Init;
		});
	}

	private init() {
		this._camera = this._cameraFactory();
		this._renderer = this._rendererFactory();
		this._world = this._worldFactory();

		this._world.init();

		const player = this._playerFactory();
		this._world.setPlayer(player);
		this._world.initMonsters();

		this._uiRoot = this._uiRootFactory();
		this._nextState = CoreState.Run;
	}

	private restart() {
		this.onRestart();

		this._uiRoot.dispose();
		this._uiRoot = null;

		this._camera = null;

		this._renderer.dispose();
		this._renderer = null;

		this._world.dispose();
		this._world = null;

		this._assetService.dispose();
		this._assetService = null;

		this._nextState = CoreState.Load;
	}
}
