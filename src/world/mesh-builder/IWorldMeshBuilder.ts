import * as THREE from "three";

import { MapLoaderResult, Rectangle } from "../map/loader/IMapLoader";

export default interface IWorldMeshBuilder {
	dispose(): void;
	buildWorldMesh(mapLoaderResult: MapLoaderResult): THREE.Object3D;
	getMovingMesh(rectangle: Rectangle): THREE.Mesh;
}
