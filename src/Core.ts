import * as THREE from "three";

import ILogger from "./common/logger/ILogger";
import IAssetService from "./asset/IAssetService";
import ICamera from "./camera/ICamera";
import IRenderer from "./renderer/IRenderer";
import IWorldComponent from "./world/IWorldComponent";
import IWorld from "./world/IWorld";
import CoreState from "./CoreState";
import IInputTracker from "./input-tracker/IInputTracker";
import IPlayer from "./player/IPlayer";
import ICore from "./ICore";
import IMonster from "./monster/IMonster";

export default class Core implements ICore {
	private _assets: object | null;
	private _state: CoreState;
	private _nextState: CoreState | null;
	private _camera: ICamera | null;
	private _world: IWorld & IWorldComponent | null;
	private _renderer: IRenderer | null;
	private _player: IPlayer | null;
	private _monsters: IMonster[] | null;

	constructor(private _logger: ILogger,
		private _assetService: IAssetService,
		private _inputTracker: IInputTracker,
		private _cameraFactory: () => ICamera,
		private _rendererFactory: () => IRenderer,
		private _worldFactory: () => IWorld & IWorldComponent,
		private _playerFactory: () => IPlayer,
		private _monsterFactory: () => IMonster) {

		this._assets = null;
		this._state = CoreState.None;
		this._nextState = null;
		this._camera = null;
		this._world = null;
		this._renderer = null;
		this._player = null;
		this._monsters = null;

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
				this._player.update();
				this._monsters.forEach(x => x.update());
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
		this._camera = this._cameraFactory();
		this._renderer = this._rendererFactory();
		this._world = this._worldFactory();

		this._world.init().then(() => {
			this._player = this._playerFactory();

			this._monsters = [];

			const m0 = this._monsterFactory();
			m0.init(new THREE.Vector3(0, 0, 0));
			this._monsters.push(m0);

			const m1 = this._monsterFactory();
			m1.init(new THREE.Vector3(this._world.map.size - 1, 0, 0));
			this._monsters.push(m1);

			const m2 = this._monsterFactory();
			m2.init(new THREE.Vector3(this._world.map.size - 1, 0, this._world.map.size - 1));
			this._monsters.push(m2);

			const m3 = this._monsterFactory();
			m3.init(new THREE.Vector3(0, 0, this._world.map.size - 1));
			this._monsters.push(m3);

			this._nextState = CoreState.Run;
		});
	}
}
