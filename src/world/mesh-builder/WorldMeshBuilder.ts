import * as THREE from "three";

import Map from "../map/Map";
import CellType from "../map/CellType";
import { Rectangle } from "../map/loader/MapLoader";

const CellSize = 1;
const WallHeight = 2;
const FloorColor = new THREE.Color(0.5, 0.5, 0.5);
const WallColor = new THREE.Color(0.35, 0.35, 0.35);

export default class WorldMeshBuilder {
	private _map: Map;
	private _rectangles: Rectangle[];
	private _rootMesh: THREE.Object3D;
	private _geometries: { [key: string]: THREE.BufferGeometry };
	private _materials: { [key: string]: THREE.Material };

	constructor() {
		this._geometries = {};
		this._materials = {};

		this.initGeometriesAndMaterials();
	}

	buildWorldMesh(map: Map, rectangles: Rectangle[]): THREE.Object3D {
		this._map = map;
		this._rectangles = rectangles;
		this._rootMesh = new THREE.Object3D();

		rectangles.forEach(rectangle => {
			const geometry = this.getFloorGeometry(rectangle);
			const material = rectangle.type === CellType.EmptyFloor ? this._materials.floorConcrete : this._materials.ceilingConcrete;

			const floorMesh = new THREE.Mesh(geometry, material);
			if (rectangle.type === CellType.Concrete) {
				floorMesh.position.y = WallHeight;
			}

			this._rootMesh.add(floorMesh);
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

	private initGeometriesAndMaterials() {
		this._geometries.concrete = new THREE.PlaneBufferGeometry();

		this._materials.floorConcrete = new THREE.MeshPhongMaterial({ color: FloorColor });
		this._materials.ceilingConcrete = new THREE.MeshPhongMaterial({ color: WallColor });
		this._materials.wallConcrete = new THREE.MeshPhongMaterial({ color: WallColor });

		this._materials.translucentWallConcrete = new THREE.MeshPhongMaterial({ color: WallColor });
		this._materials.translucentWallConcrete.opacity = 0.5;
		this._materials.translucentWallConcrete.transparent = true;
	}

	private getEmptyFloorCellMesh(cell: object, x: number, y: number): THREE.Object3D {
		const cellMesh = new THREE.Object3D();
		cellMesh.position.set(x, 0, y);

		const floorMesh = new THREE.Mesh(this._geometries.concrete, this._materials.floorConcrete);
		floorMesh.rotation.x = -Math.PI / 2;
		cellMesh.add(floorMesh);

		const topAdjacentCell = this._map.getCell(x, y - 1);

		if (!topAdjacentCell || topAdjacentCell.type === CellType.Void || topAdjacentCell.type === CellType.Concrete) {
			const topWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.wallConcrete);

			topWallMesh.scale.set(1, WallHeight, 1);
			topWallMesh.position.z -= 0.5;
			topWallMesh.position.y = WallHeight / 2;

			cellMesh.add(topWallMesh);
		}

		const rightAdjacentCell = this._map.getCell(x + 1, y);

		if (!rightAdjacentCell || rightAdjacentCell.type === CellType.Void || rightAdjacentCell.type === CellType.Concrete) {
			const rightWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.wallConcrete);

			rightWallMesh.scale.set(1, WallHeight, 1);
			rightWallMesh.position.x += 0.5;
			rightWallMesh.position.y = WallHeight / 2;
			rightWallMesh.rotation.y = -Math.PI / 2;

			cellMesh.add(rightWallMesh);
		}

		this.addBottomAndLeftWalls(cellMesh, x, y);

		return cellMesh;
	}

	private addBottomAndLeftWalls(cellMesh: THREE.Object3D, x: number, y: number) {
		const bottomAdjacentCell = this._map.getCell(x, y + 1);

		if (!bottomAdjacentCell || bottomAdjacentCell.type === CellType.Void || bottomAdjacentCell.type === CellType.Concrete) {
			const bottomWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.translucentWallConcrete);

			bottomWallMesh.scale.set(1, WallHeight, 1);
			bottomWallMesh.position.z += 0.5;
			bottomWallMesh.position.y = WallHeight / 2;

			cellMesh.add(bottomWallMesh);
		}

		const leftAdjacentCell = this._map.getCell(x - 1, y);

		if (!leftAdjacentCell || leftAdjacentCell.type === CellType.Void || leftAdjacentCell.type === CellType.Concrete) {
			const leftWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.translucentWallConcrete);

			leftWallMesh.scale.set(1, WallHeight, 1);
			leftWallMesh.position.x -= 0.5;
			leftWallMesh.position.y = WallHeight / 2;
			leftWallMesh.rotation.y = -Math.PI / 2;

			cellMesh.add(leftWallMesh);
		}
	}
}
