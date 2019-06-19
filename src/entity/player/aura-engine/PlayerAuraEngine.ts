import IPlayerAuraEngine from "./IPlayerAuraEngine";
import AuraType from "./AuraType";
import IPlayer from "../IPlayer";
import IAura from "./IAura";
import getAuras from "./AuraFactory";
import { FramesPerTick } from "./AuraTick";

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
		this._tickFrames = FramesPerTick;
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
		aura.resetTicks();

		if (aura.maxStacks > 1 && this._auras.has(aura)) {
			aura.addStack();
		} else {
			aura.resetStacks();
			this._auras.add(aura);
		}
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
				this._tickFrames = FramesPerTick;
				this.tick();
			}
		}
	}

	private tick() {
		const toRemove: IAura[] = [];

		this._auras.forEach(x => {
			if (x.isTimeBased()) {
				x.tick();

				if (x.ticks === 0) {
					toRemove.push(x);
				}
			}
		});

		toRemove.forEach(x => this._auras.delete(x));
	}
}
