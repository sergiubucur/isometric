import * as THREE from "three";

import IScene from "./IScene";
import TestMap from "./TestMap";
import CellType from "./CellType";

export default class Scene implements IScene {
	readonly scene: THREE.Scene;

	map: any;
	mapSize: number;

	constructor() {
		this.scene = new THREE.Scene();
	}

	init(): Promise<void> {
		return new Promise((resolve) => {
			this.loadMap();
			this.initLights();

			const geometry = new THREE.PlaneBufferGeometry();
			const material1 = new THREE.MeshPhongMaterial({ color: new THREE.Color(0.13, 0.16, 0.19) });
			const material2 = new THREE.MeshPhongMaterial({ color: new THREE.Color(0.23, 0.26, 0.29) });

			for (let y = 0; y < this.mapSize; y++) {
				for (let x = 0; x < this.mapSize; x++) {
					const cell = this.map[y][x];
					if (cell.type === CellType.Void) {
						continue;
					}

					const mesh = new THREE.Mesh(geometry, (x + y) % 2 === 0 ? material1 : material2);
					mesh.position.set(x, 0, y);
					mesh.rotation.x = -Math.PI / 2;

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

					case "[]":
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
}
