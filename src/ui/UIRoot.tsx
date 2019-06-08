import React from "react";
import ReactDOM from "react-dom";

import Minimap from "./minimap/Minimap";
import IWorld from "../world/IWorld";
import IPlayer from "../entity/player/IPlayer";
import IUIRoot from "./IUIRoot";

export default class UIRoot implements IUIRoot {
	constructor(private _world: IWorld, private _player: IPlayer) {
		ReactDOM.render(
			<Minimap
				world={this._world}
				player={this._player}>
			</Minimap>, document.getElementById("root"));
	}
}
