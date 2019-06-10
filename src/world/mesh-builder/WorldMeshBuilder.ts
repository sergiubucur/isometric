import * as THREE from "three";

import CellType from "../map/CellType";
import { Rectangle, MapLoaderResult, Edge } from "../map/loader/MapLoader";
import IWorldMeshBuilder from "./IWorldMeshBuilder";
import IMap from "../map/IMap";

const CellSize = 1;
const WallHeight = 2;
const FloorColor = new THREE.Color(0.5, 0.5, 0.5);
const WallColor = new THREE.Color(0.35, 0.35, 0.35);

export default class WorldMeshBuilder implements IWorldMeshBuilder {
	private _map: IMap;
	private _rectangles: Rectangle[];
	private _edges: Edge[];
	private _rootMesh: THREE.Object3D;
	private _geometries: { [key: string]: THREE.BufferGeometry };
	private _materials: { [key: string]: THREE.Material };

	constructor() {
		this._geometries = {};
		this._materials = {};

		this.initGeometriesAndMaterials();
	}

	buildWorldMesh(mapLoaderResult: MapLoaderResult): THREE.Object3D {
		this._map = mapLoaderResult.map;
		this._rectangles = mapLoaderResult.rectangles;
		this._edges = mapLoaderResult.edges;
		this._rootMesh = new THREE.Object3D();

		this._rectangles.forEach(rectangle => {
			if (rectangle.type === CellType.Void) {
				return;
			}

			const geometry = this.getFloorGeometry(rectangle);
			const material = rectangle.type === CellType.EmptyFloor ? this._materials.floorConcrete : this._materials.ceilingConcrete;

			const floorMesh = new THREE.Mesh(geometry, material);
			if (rectangle.type === CellType.Concrete) {
				floorMesh.position.y = WallHeight;
			}

			this._rootMesh.add(floorMesh);
		});

		this._edges.forEach(edge => {
			const geometry = this.getWallGeometry(edge);
			const material = this._materials.wallConcrete;

			const wallMesh = new THREE.Mesh(geometry, material);

			this._rootMesh.add(wallMesh);
		});

		console.log("world mesh count", this._rootMesh.children.length);

		return this._rootMesh;
	}

	private getFloorGeometry(rectangle: Rectangle) {
		const geometry = new THREE.Geometry();

		geometry.vertices.push(new THREE.Vector3(rectangle.x0 - CellSize / 2, 0, rectangle.y0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(rectangle.x1 - CellSize / 2, 0, rectangle.y0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(rectangle.x1 - CellSize / 2, 0, rectangle.y1 - CellSize / 2));

		geometry.vertices.push(new THREE.Vector3(rectangle.x0 - CellSize / 2, 0, rectangle.y0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(rectangle.x1 - CellSize / 2, 0, rectangle.y1 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(rectangle.x0 - CellSize / 2, 0, rectangle.y1 - CellSize / 2));

		geometry.faces.push(new THREE.Face3(2, 1, 0));
		geometry.faces.push(new THREE.Face3(5, 4, 3));

		geometry.mergeVertices();
		geometry.computeVertexNormals();

		return new THREE.BufferGeometry().fromGeometry(geometry);
	}

	private getWallGeometry(edge: Edge) {
		const geometry = new THREE.Geometry();

		geometry.vertices.push(new THREE.Vector3(edge.x0 - CellSize / 2, 0, edge.y0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(edge.x0 - CellSize / 2, WallHeight, edge.y0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(edge.x1 - CellSize / 2, 0, edge.y1 - CellSize / 2));

		geometry.vertices.push(new THREE.Vector3(edge.x0 - CellSize / 2, WallHeight, edge.y0 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(edge.x1 - CellSize / 2, WallHeight, edge.y1 - CellSize / 2));
		geometry.vertices.push(new THREE.Vector3(edge.x1 - CellSize / 2, 0, edge.y1 - CellSize / 2));

		geometry.faces.push(new THREE.Face3(2, 1, 0));
		geometry.faces.push(new THREE.Face3(5, 4, 3));

		geometry.mergeVertices();
		geometry.computeVertexNormals();

		return new THREE.BufferGeometry().fromGeometry(geometry);
	}

	private initGeometriesAndMaterials() {
		this._geometries.concrete = new THREE.PlaneBufferGeometry();

		this._materials.floorConcrete = new THREE.MeshPhongMaterial({ color: FloorColor });
		this._materials.ceilingConcrete = new THREE.MeshPhongMaterial({ color: WallColor });
		this._materials.wallConcrete = new THREE.MeshPhongMaterial({ color: WallColor });

		this._materials.translucentWallConcrete = new THREE.MeshPhongMaterial({ color: WallColor });
		this._materials.translucentWallConcrete.opacity = 0.5;
		this._materials.translucentWallConcrete.transparent = true;
	}
}
