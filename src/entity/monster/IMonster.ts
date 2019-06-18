import * as THREE from "three";

import IComponent from "../../common/IComponent";

export default interface IMonster extends IComponent {
	readonly id: number;
	readonly dead: boolean;
	readonly size: number;

	init(position: THREE.Vector3): void;
	damage(): void;
}

export function isMonster(entity: IComponent): entity is IMonster {
	return (entity as IMonster).damage !== undefined;
}
