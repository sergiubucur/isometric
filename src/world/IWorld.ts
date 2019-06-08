import * as THREE from "three";

import IMap from "./map/IMap";

export default interface IWorld {
	readonly map: IMap;

	addMesh(mesh: THREE.Mesh): void;
}
