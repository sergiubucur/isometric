import { MapLoaderResult } from "../map/loader/IMapLoader";

export default interface IWorldMeshBuilder {
	buildWorldMesh(mapLoaderResult: MapLoaderResult): THREE.Object3D;
}
