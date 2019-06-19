import IPlayerAuraEngine from "./IPlayerAuraEngine";
import AuraType from "../../aura/AuraType";
import IPlayer from "../IPlayer";

const TickTotalFrames = 6;

export default class PlayerAuraEngine implements IPlayerAuraEngine {
	get auras() {
		return Array.from(this._auras);
	}

	private _auras: Set<AuraType>;
	private _player: IPlayer;
	private _tickFrames: number;

	constructor() {
		this._auras = new Set<AuraType>();
		this._tickFrames = TickTotalFrames;
	}

	init(player: IPlayer) {
		this._player = player;
	}

	addAura(type: AuraType) {
		this._auras.add(type);
	}

	removeAura(type: AuraType) {
		this._auras.delete(type);
	}

	hasAura(type: AuraType) {
		return this._auras.has(type);
	}

	clearAuras() {
		this._auras.clear();
	}

	update() {
		if (this._tickFrames > 0) {
			this._tickFrames--;

			if (this._tickFrames === 0) {
				this._tickFrames = TickTotalFrames;
				this.applyAuras();
			}
		}
	}

	private applyAuras() {
		this._auras.forEach(x => {
			switch (x) {
				case AuraType.Energized:
					this._player.gainHealth(1);
					this._player.gainMana(1);
					break;
			}
		});
	}
}
