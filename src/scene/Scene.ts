import * as THREE from "three";

import IScene from "./IScene";
import TestMap from "./TestMap";
import CellType from "./CellType";

const WallHeight = 2;
const FloorColor = new THREE.Color(0.5, 0.5, 0.5);
const WallColor = new THREE.Color(0.35, 0.35, 0.35);

export default class Scene implements IScene {
	readonly scene: THREE.Scene;
	map: any;
	mapSize: number;

	private _geometries: { [key: string]: THREE.BufferGeometry };
	private _materials: { [key: string]: THREE.Material };

	constructor() {
		this.scene = new THREE.Scene();
		this._geometries = {};
		this._materials = {};
	}

	init(): Promise<void> {
		return new Promise((resolve) => {
			this.loadMap();
			this.initLights();
			this.initGeometriesAndMaterials();

			for (let y = 0; y < this.mapSize; y++) {
				for (let x = 0; x < this.mapSize; x++) {
					const cell = this.map[y][x];

					let mesh;
					if (cell.type === CellType.EmptyFloor) {
						mesh = this.getEmptyFloorCellMesh(cell, x, y);
					} else {
						mesh = this.getVoidCellMesh(cell, x, y);
					}

					this.scene.add(mesh);
				}
			}

			setTimeout(() => {
				resolve();
			});
		});
	}

	update() {
	}

	private initLights() {
		const ambLight = new THREE.AmbientLight(new THREE.Color(0.25, 0.25, 0.25));
		this.scene.add(ambLight);

		const dirLight = new THREE.DirectionalLight(new THREE.Color(1, 0.85, 0.7));
		dirLight.position.set(-0.25, 0.5, -0.75).normalize();
		this.scene.add(dirLight);
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

	private loadMap() {
		const mapData = TestMap.split("\n").filter(x => x.length > 0);

		const mapSize = mapData.length;
		const map = [];

		for (let y = 0; y < mapSize; y++) {
			const row = [];

			for (let x = 0; x < mapSize * 2; x += 2) {
				const cellStr = mapData[y].substr(x, 2);
				const cell: any = {};

				switch (cellStr) {
					case "..":
						cell.type = CellType.Void;
						break;

					case "AB":
						cell.type = CellType.EmptyFloor;
						break;

					default:
						throw new Error("invalid cell");
				}

				row.push(cell);
			}

			map.push(row);
		}

		this.map = map;
		this.mapSize = mapSize;
	}

	convertToMapPosition(position: THREE.Vector3, round = false): THREE.Vector3 {
		const mapPosition = position.clone();

		const method = round ? "round" : "floor";

		mapPosition.x = THREE.Math.clamp(Math[method](mapPosition.x), 0, this.mapSize - 1);
		mapPosition.z = THREE.Math.clamp(Math[method](mapPosition.z), 0, this.mapSize - 1);

		return mapPosition;
	}

	private getEmptyFloorCellMesh(cell: object, x: number, y: number): THREE.Object3D {
		const cellMesh = new THREE.Object3D();
		cellMesh.position.set(x, 0, y);

		const floorMesh = new THREE.Mesh(this._geometries.concrete, this._materials.floorConcrete);
		floorMesh.rotation.x = -Math.PI / 2;
		cellMesh.add(floorMesh);

		const topAdjacentCell = this.getCell(x, y - 1);

		if (!topAdjacentCell || topAdjacentCell.type === CellType.Void) {
			const topWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.wallConcrete);

			topWallMesh.scale.set(1, WallHeight, 1);
			topWallMesh.position.z -= 0.5;
			topWallMesh.position.y = WallHeight / 2;

			cellMesh.add(topWallMesh);
		}

		const rightAdjacentCell = this.getCell(x + 1, y);

		if (!rightAdjacentCell || rightAdjacentCell.type === CellType.Void) {
			const rightWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.wallConcrete);

			rightWallMesh.scale.set(1, WallHeight, 1);
			rightWallMesh.position.x += 0.5;
			rightWallMesh.position.y = WallHeight / 2;
			rightWallMesh.rotation.y = -Math.PI / 2;

			cellMesh.add(rightWallMesh);
		}

		// const bottomAdjacentCell = this.getCell(x, y + 1);

		// if (!bottomAdjacentCell || bottomAdjacentCell.type === CellType.Void) {
		// 	const bottomWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.translucentWallConcrete);

		// 	bottomWallMesh.scale.set(1, WallHeight, 1);
		// 	bottomWallMesh.position.z += 0.5;
		// 	bottomWallMesh.position.y = WallHeight / 2;

		// 	cellMesh.add(bottomWallMesh);
		// }

		// const leftAdjacentCell = this.getCell(x - 1, y);

		// if (!leftAdjacentCell || leftAdjacentCell.type === CellType.Void) {
		// 	const leftWallMesh = new THREE.Mesh(this._geometries.concrete, this._materials.translucentWallConcrete);

		// 	leftWallMesh.scale.set(1, WallHeight, 1);
		// 	leftWallMesh.position.x -= 0.5;
		// 	leftWallMesh.position.y = WallHeight / 2;
		// 	leftWallMesh.rotation.y = -Math.PI / 2;

		// 	cellMesh.add(leftWallMesh);
		// }

		return cellMesh;
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

	private getCell(x: number, y: number): any | null {
		if (x >= 0 && x < this.mapSize && y >= 0 && y < this.mapSize) {
			return this.map[y][x];
		}

		return null;
	}
}
