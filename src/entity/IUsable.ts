import * as THREE from "three";

export default interface IUsable {
	use(): void;
	canUse(position: THREE.Vector3): boolean;
	canHighlight(): boolean;
	setHighlight(value: boolean): void;
}

export function isUsable(entity: object): entity is IUsable {
	return (entity as IUsable).use !== undefined;
}
