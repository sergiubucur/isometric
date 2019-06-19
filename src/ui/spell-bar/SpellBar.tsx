import React, { PureComponent } from "react";

import IPlayer from "../../entity/player/IPlayer";
import { SpellBarContainer } from "./styles";
import SpellIcon from "./SpellIcon";
import SpellKeybindAssignment from "../../entity/player/spell-engine/SpellKeybindAssignment";
import ITooltipService from "../tooltip/service/ITooltipService";
import UIConstants from "../common/UIConstants";

type Props = {
	player: IPlayer,
	tooltipService: ITooltipService
};

type State = {
	spells: SpellKeybindAssignment[],
	activeSpell: SpellKeybindAssignment | null,
	globalCooldown: number,
	mana: number
};

export default class SpellBar extends PureComponent<Props, State> {
	state: State = {
		spells: [],
		activeSpell: null,
		globalCooldown: 0,
		mana: 0
	};

	private _intervalId: number;

	componentDidMount() {
		this._intervalId = setInterval(() => {
			const { player } = this.props;
			const { spells, activeSpell, globalCooldown } = player.spellEngine;

			this.setState({
				mana: player.mana,
				spells,
				activeSpell,
				globalCooldown
			});
		}, UIConstants.RefreshIntervalMs);
	}

	componentWillUnmount() {
		clearInterval(this._intervalId);
	}

	render() {
		const { tooltipService } = this.props;
		const { spells, activeSpell, globalCooldown, mana } = this.state;

		return (
			<SpellBarContainer>

				{spells.map((x, i) => (
					<SpellIcon
						key={i}
						data={x}
						active={x === activeSpell}
						cooldown={globalCooldown}
						unusable={x.spell.manaCost > mana}
						tooltipService={tooltipService} />
				))}

			</SpellBarContainer>
		);
	}
}
