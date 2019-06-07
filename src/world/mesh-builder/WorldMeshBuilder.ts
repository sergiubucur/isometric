import * as THREE from "three";

import Map from "../map/Map";
import CellType from "../map/CellType";

const WallHeight = 2;
const FloorColor = new THREE.Color(0.5, 0.5, 0.5);
const WallColor = new THREE.Color(0.35, 0.35, 0.35);

export default class WorldMeshBuilder {
	private _map: Map;
	private _rootMesh: THREE.Object3D;
	private _geometries: { [key: string]: THREE.BufferGeometry };
	private _materials: { [key: string]: THREE.Material };

	constructor() {
		this._geometries = {};
		this._materials = {};

		this.initGeometriesAndMaterials();
	}

	buildWorldMesh(map: Map): THREE.Object3D {
		this._map = map;
		this._rootMesh = new THREE.Object3D();

		for (let y = 0; y < this._map.size; y++) {
			for (let x = 0; x < this._map.size; x++) {
				const cell = this._map.cells[y][x];

				let mesh;
				if (cell.type === CellType.EmptyFloor) {
					mesh = this.getEmptyFloorCellMesh(cell, x, y);
				} else {
					mesh = this.getVoidCellMesh(cell, x, y);
				}

				this._rootMesh.add(mesh);
			}
		}

		return this._rootMesh;
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

		if (!topAdjacentCell || topAdjacentCell.type === CellType.Void) {
			const topWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.wallConcrete);

			topWallMesh.scale.set(1, WallHeight, 1);
			topWallMesh.position.z -= 0.5;
			topWallMesh.position.y = WallHeight / 2;

			cellMesh.add(topWallMesh);
		}

		const rightAdjacentCell = this._map.getCell(x + 1, y);

		if (!rightAdjacentCell || rightAdjacentCell.type === CellType.Void) {
			const rightWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.wallConcrete);

			rightWallMesh.scale.set(1, WallHeight, 1);
			rightWallMesh.position.x += 0.5;
			rightWallMesh.position.y = WallHeight / 2;
			rightWallMesh.rotation.y = -Math.PI / 2;

			cellMesh.add(rightWallMesh);
		}

		// this.addBottomAndLeftWalls(cellMesh, x, y);

		return cellMesh;
	}

	private addBottomAndLeftWalls(cellMesh: THREE.Object3D, x: number, y: number) {
		const bottomAdjacentCell = this._map.getCell(x, y + 1);

		if (!bottomAdjacentCell || bottomAdjacentCell.type === CellType.Void) {
			const bottomWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.translucentWallConcrete);

			bottomWallMesh.scale.set(1, WallHeight, 1);
			bottomWallMesh.position.z += 0.5;
			bottomWallMesh.position.y = WallHeight / 2;

			cellMesh.add(bottomWallMesh);
		}

		const leftAdjacentCell = this._map.getCell(x - 1, y);

		if (!leftAdjacentCell || leftAdjacentCell.type === CellType.Void) {
			const leftWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.translucentWallConcrete);

			leftWallMesh.scale.set(1, WallHeight, 1);
			leftWallMesh.position.x -= 0.5;
			leftWallMesh.position.y = WallHeight / 2;
			leftWallMesh.rotation.y = -Math.PI / 2;

			cellMesh.add(leftWallMesh);
		}
	}

	private getVoidCellMesh(cell: object, x: number, y: number): THREE.Object3D {
		const cellMesh = new THREE.Object3D();
		cellMesh.position.set(x, 0, y);

		const ceiling = new THREE.Mesh(this._geometries.concrete, this._materials.ceilingConcrete);
		ceiling.position.y = WallHeight;
		ceiling.rotation.x = -Math.PI / 2;
		cellMesh.add(ceiling);

		return cellMesh;
	}
}
