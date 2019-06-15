import { MapLoaderResult } from "../map/loader/IMapLoader";

export default interface IWorldMeshBuilder {
	dispose(): void;
	buildWorldMesh(mapLoaderResult: MapLoaderResult): THREE.Object3D;
}
