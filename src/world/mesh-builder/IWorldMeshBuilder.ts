import Map from "../map/Map";
import { Rectangle } from "../map/loader/MapLoader";

export default interface IWorldMeshBuilder {
	buildWorldMesh(map: Map, rectangles: Rectangle[]): THREE.Object3D;
}
