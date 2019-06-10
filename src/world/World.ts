import * as THREE from "three";

import IWorldMeshBuilder from "./mesh-builder/IWorldMeshBuilder";
import IWorld from "./IWorld";
import IWorldComponent from "./IWorldComponent";
import IMapLoader from "./map/loader/IMapLoader";
import IAssetService from "../asset/IAssetService";
import IMonster from "../entity/monster/IMonster";
import CellType from "./map/CellType";
import IMap from "./map/IMap";

export default class World implements IWorld, IWorldComponent {
	readonly scene: THREE.Scene;
	map: IMap;

	private _monsters: IMonster[] | null;

	constructor(private _assetService: IAssetService, private _mapLoader: IMapLoader, private _worldMeshBuilder: IWorldMeshBuilder,
		private _monsterFactory: () => IMonster) {

		this.scene = new THREE.Scene();
		this._monsters = [];
	}

	init(): Promise<void> {
		return new Promise((resolve) => {
			this.initMap();
			this.initLights();

			setTimeout(() => {
				resolve();
			});
		});
	}

	update() {
		this._monsters.forEach(x => x.update());
	}

	addMesh(mesh: THREE.Mesh): void {
		this.scene.add(mesh);
	}

	initMonsters() {
		this._monsters = [];

		for (let z = 0; z < this.map.size; z++) {
			for (let x = 0; x < this.map.size; x++) {
				if (x < 64 && z < 64) {
					continue;
				}

				const cell = this.map.getCell(x, z);
				if (!cell || cell.type !== CellType.EmptyFloor) {
					continue;
				}

				if (Math.random() < 0.0025) {
					this.addMonster(new THREE.Vector3(x, 0, z));
				}
			}
		}

		console.log("monster count", this._monsters.length);
	}

	private initMap() {
		const result = this._mapLoader.loadMap(this._assetService.assets.test.content as HTMLImageElement);
		this.map = result.map;

		const worldMesh = this._worldMeshBuilder.buildWorldMesh(result);
		this.scene.add(worldMesh);
	}

	private initLights() {
		const ambLight = new THREE.AmbientLight(new THREE.Color(0.25, 0.25, 0.25));
		this.scene.add(ambLight);

		const dirLight = new THREE.DirectionalLight(new THREE.Color(1, 0.85, 0.7));
		dirLight.position.set(-0.25, 0.5, -0.75).normalize();
		this.scene.add(dirLight);
	}

	private addMonster(position: THREE.Vector3) {
		const monster = this._monsterFactory();
		monster.init(position);

		this._monsters.push(monster);
	}
}
