import * as THREE from "three";

import IComponent from "../common/IComponent";
import IPlayer from "../entity/player/IPlayer";

export default interface IWorldComponent extends IComponent {
	readonly scene: THREE.Scene;

	init(): void;
	initEntities(): void;
	setPlayer(player: IPlayer): void;
}
