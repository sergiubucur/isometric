import * as THREE from "three";

import IComponent from "../../common/IComponent";
import { Rectangle } from "../../world/map/loader/IMapLoader";

export default interface IDoor extends IComponent {
	id: number;

	init(rectangle: Rectangle, mesh: THREE.Mesh): void;
	open(): void;
	close(): void;
	isInRange(position: THREE.Vector3): boolean;
}

export function isDoor(entity: IComponent): entity is IDoor {
	return (entity as IDoor).open !== undefined;
}
