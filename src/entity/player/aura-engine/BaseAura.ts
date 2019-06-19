import IPlayer from "../IPlayer";
import IAura from "./IAura";

export default abstract class BaseSpell implements IAura {
	name: string;
	iconName: string;
	flipIcon: boolean;
	abstract tooltip: React.FunctionComponent;

	protected _player: IPlayer;

	constructor() {
		this.name = "BaseAura";
		this.iconName = "ra-sword";
		this.flipIcon = false;
	}

	init(player: IPlayer) {
		this._player = player;
	}

	abstract tick(): void;
}
