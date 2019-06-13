import * as THREE from "three";

import IComponent from "../../common/IComponent";

export default interface IMonster extends IComponent {
	readonly id: number;
	readonly dead: boolean;

	init(position: THREE.Vector3): void;
	damage(): void;
}
