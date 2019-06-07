import * as THREE from "three";

import Map from "./map/Map";

export default interface IWorld {
	readonly map: Map;

	addMesh(mesh: THREE.Mesh): void;
}
