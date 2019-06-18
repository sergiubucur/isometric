import * as THREE from "three";

import IComponent from "../../common/IComponent";
import { Rectangle } from "../../world/map/loader/IMapLoader";
import IUsable from "../IUsable";

export default interface IDoor extends IComponent, IUsable {
	readonly id: number;

	init(rectangle: Rectangle, mesh: THREE.Mesh): void;
	open(): void;
	close(): void;
}

export function isDoor(entity: object): entity is IDoor {
	return (entity as IDoor).open !== undefined;
}
