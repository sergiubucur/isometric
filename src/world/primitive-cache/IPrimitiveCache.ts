import * as THREE from "three";

export default interface IPrimitiveCache {
	getGeometry<T extends THREE.BufferGeometry>(key: string, factory: () => T): T;
	getMaterial<T extends THREE.Material>(key: string, factory: () => T): T;
	dispose(): void;
}
