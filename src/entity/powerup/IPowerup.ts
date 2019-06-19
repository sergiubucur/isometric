import * as THREE from "three";

import IComponent from "../../common/IComponent";
import PowerupType from "./PowerupType";

export default interface IPowerup extends IComponent {
	readonly id: number;
	readonly toBeDeleted: boolean;
	readonly size: number;
	readonly type: PowerupType;

	init(type: PowerupType, position: THREE.Vector3): void;
	dispose(): void;
	occupyMapCells(): void;
	markForDeletion(): void;
}
