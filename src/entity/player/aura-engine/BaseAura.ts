import IPlayer from "../IPlayer";
import IAura from "./IAura";

export default abstract class BaseSpell implements IAura {
	name: string;
	iconName: string;
	flipIcon: boolean;
	abstract tooltip: React.FunctionComponent;
	ticks: number;
	totalTicks: number;

	protected _player: IPlayer;

	constructor() {
		this.name = "BaseAura";
		this.iconName = "ra-sword";
		this.flipIcon = false;
		this.ticks = 0;
		this.totalTicks = 0;
	}

	init(player: IPlayer) {
		this._player = player;
	}

	tick() {
		this.ticks--;

		console.log("tick");
	}

	reset() {
		this.ticks = this.totalTicks;
	}

	isTimeBased() {
		return this.totalTicks > 0;
	}
}
