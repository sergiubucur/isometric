import Map from "../map/Map";

export default interface IWorldMeshBuilder {
	buildWorldMesh(map: Map): THREE.Object3D;
}
