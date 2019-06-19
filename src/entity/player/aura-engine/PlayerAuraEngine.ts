import IPlayerAuraEngine from "./IPlayerAuraEngine";
import AuraType from "./AuraType";
import IPlayer from "../IPlayer";
import IAura from "./IAura";
import getAuras from "./AuraFactory";

const TickTotalFrames = 6;

export default class PlayerAuraEngine implements IPlayerAuraEngine {
	get auras() {
		return Array.from(this._auras);
	}

	private _auras: Set<IAura>;
	private _allAuras: { [key: string]: IAura };
	private _player: IPlayer;
	private _tickFrames: number;

	constructor() {
		this._auras = new Set<IAura>();
		this._tickFrames = TickTotalFrames;
	}

	init(player: IPlayer) {
		this._player = player;

		this._allAuras = getAuras();
		Object.keys(this._allAuras).forEach(key => {
			this._allAuras[key].init(this._player);
		});
	}

	addAura(type: AuraType) {
		const aura = this._allAuras[type];
		this._auras.add(aura);
	}

	removeAura(type: AuraType) {
		const aura = this._allAuras[type];
		this._auras.delete(aura);
	}

	hasAura(type: AuraType) {
		const aura = this._allAuras[type];
		return this._auras.has(aura);
	}

	clearAuras() {
		this._auras.clear();
	}

	update() {
		if (this._tickFrames > 0) {
			this._tickFrames--;

			if (this._tickFrames === 0) {
				this._tickFrames = TickTotalFrames;
				this._auras.forEach(x => x.tick());
			}
		}
	}
}
