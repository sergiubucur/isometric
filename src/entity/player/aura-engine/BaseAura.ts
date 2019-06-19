import IPlayer from "../IPlayer";
import IAura from "./IAura";

export default abstract class BaseSpell implements IAura {
	name: string;
	iconName: string;
	flipIcon: boolean;
	abstract tooltip: React.FunctionComponent;
	ticks: number;
	totalTicks: number;
	stacking: boolean;
	stacks: number;

	protected _player: IPlayer;

	constructor() {
		this.name = "BaseAura";
		this.iconName = "ra-sword";
		this.flipIcon = false;
		this.totalTicks = 0;
		this.stacking = false;

		this.resetTicks();
		this.resetStacks();
	}

	init(player: IPlayer) {
		this._player = player;
	}

	tick() {
		this.ticks--;
	}

	resetTicks() {
		this.ticks = this.totalTicks;
	}

	resetStacks() {
		this.stacks = 1;
	}

	isTimeBased() {
		return this.totalTicks > 0;
	}

	addStack() {
		this.stacks++;
	}
}
