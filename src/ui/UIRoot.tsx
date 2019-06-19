import React from "react";
import ReactDOM from "react-dom";

import Minimap from "./minimap/Minimap";
import IWorld from "../world/IWorld";
import IPlayer from "../entity/player/IPlayer";
import IUIRoot from "./IUIRoot";
import ILogger from "../common/logger/ILogger";
import HealthBar from "./resource-bar/HealthBar";
import ManaBar from "./resource-bar/ManaBar";
import SpellBar from "./spell-bar/SpellBar";
import Tooltip from "./tooltip/Tooltip";
import DeathMessage from "./death-message/DeathMessage";
import ITooltipService from "./tooltip/service/ITooltipService";
import ITooltipConnector from "./tooltip/service/ITooltipConnector";
import ExperienceBar from "./resource-bar/ExperienceBar";

export default class UIRoot implements IUIRoot {
	constructor(private _world: IWorld, private _player: IPlayer, private _logger: ILogger, private _tooltipService: ITooltipService) {
		ReactDOM.render(
			<React.Fragment>

				<Minimap
					world={this._world}
					player={this._player}
					logger={this._logger}>
				</Minimap>

				<HealthBar
					player={this._player}>
				</HealthBar>

				<ManaBar
					player={this._player}>
				</ManaBar>

				<ExperienceBar
					player={this._player}>
				</ExperienceBar>

				<SpellBar
					player={this._player}
					tooltipService={this._tooltipService}>
				</SpellBar>

				<Tooltip
					connector={this._tooltipService as unknown as ITooltipConnector}></Tooltip>

				<DeathMessage
					player={this._player}>
				</DeathMessage>

			</React.Fragment>, document.getElementById("root"));
	}

	dispose() {
		ReactDOM.unmountComponentAtNode(document.getElementById("root"));
	}
}
