import { MapLoaderResult } from "../map/loader/MapLoader";

export default interface IWorldMeshBuilder {
	buildWorldMesh(mapLoaderResult: MapLoaderResult): THREE.Object3D;
}
