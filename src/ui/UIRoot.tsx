import React from "react";
import ReactDOM from "react-dom";

import Minimap from "./minimap/Minimap";
import IWorld from "../world/IWorld";
import IPlayer from "../entity/player/IPlayer";
import IUIRoot from "./IUIRoot";
import ILogger from "../common/logger/ILogger";

export default class UIRoot implements IUIRoot {
	constructor(private _world: IWorld, private _player: IPlayer, private _logger: ILogger) {
		ReactDOM.render(
			<Minimap
				world={this._world}
				player={this._player}
				logger={this._logger}>
			</Minimap>, document.getElementById("root"));
	}

	dispose() {
		ReactDOM.unmountComponentAtNode(document.getElementById("root"));
	}
}
