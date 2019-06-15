import * as THREE from "three";

import IWorldMeshBuilder from "./mesh-builder/IWorldMeshBuilder";
import IWorld from "./IWorld";
import IWorldComponent from "./IWorldComponent";
import IMapLoader from "./map/loader/IMapLoader";
import IAssetService from "../asset/IAssetService";
import IMonster from "../entity/monster/IMonster";
import IMap from "./map/IMap";
import IProjectile from "../entity/projectile/IProjectile";
import ProjectileData from "../entity/projectile/ProjectileData";
import ILogger from "../common/logger/ILogger";
import IPlayer from "../entity/player/IPlayer";
import IPointLightCache from "./point-light-cache/IPointLightCache";

const MapName = "testMap";

export default class World implements IWorld, IWorldComponent {
	readonly scene: THREE.Scene;
	map: IMap;

	private _monsters: IMonster[];
	private _projectiles: IProjectile[];
	private _player: IPlayer | null;
	private _pointLightCache: IPointLightCache;

	constructor(private _assetService: IAssetService, private _mapLoader: IMapLoader, private _worldMeshBuilder: IWorldMeshBuilder,
		private _monsterFactory: () => IMonster, private _projectileFactory: () => IProjectile, private _logger: ILogger,
		private _pointLightCacheFactory: () => IPointLightCache) {

		this.scene = new THREE.Scene();
		this._monsters = [];
		this._projectiles = [];
		this._player = null;
	}

	init() {
		this.initMap();
		this.initLights();
	}

	setPlayer(player: IPlayer) {
		this._player = player;
	}

	update() {
		this._monsters.forEach(x => x.update());

		this._projectiles.forEach(x => {
			if (!x.toBeDeleted) {
				x.update();
			}
		});

		this._player.update();

		this.deleteMarkedEntities();

		this._logger.logNumber("entities", this._monsters.length + this._projectiles.length + 1, 0);
		this._logger.logNumber("monsters left", this._monsters.filter(x => !x.dead).length, 0);
	}

	deleteMarkedEntities() {
		this._projectiles.filter(x => x.toBeDeleted).forEach(x => x.dispose());
		this._projectiles = this._projectiles.filter(x => !x.toBeDeleted);
	}

	addMesh(mesh: THREE.Object3D) {
		this.scene.add(mesh);
	}

	removeMesh(mesh: THREE.Object3D) {
		this.scene.remove(mesh);
	}

	areaDamage(position: THREE.Vector3, radius: number, originId: number) {
		const mapPosition = this.map.convertToMapPosition(position);
		const entityIds = this.map.getAllEntityIdsInArea(mapPosition.x, mapPosition.z, radius);

		entityIds.forEach(id => {
			const monster = this._monsters.find(x => x.id === id);

			if (monster && monster.id !== originId) {
				monster.damage();
			}
		});
	}

	addProjectile(data: ProjectileData) {
		const projectile = this._projectileFactory();
		projectile.init(data);

		this._projectiles.push(projectile);
	}

	initMonsters() {
		this._monsters = [];

		for (let z = 0; z < this.map.size; z++) {
			for (let x = 0; x < this.map.size; x++) {
				if (x < 64 && z < 64) {
					continue;
				}

				if (!this.map.areaIsPassable(x, z, 3)) {
					continue;
				}

				if (Math.random() < 0.0025) {
					this.addMonster(new THREE.Vector3(x, 0, z));
				}
			}
		}

		console.log("monster count", this._monsters.length);
	}

	getMonsterAtPosition(position: THREE.Vector3, convertToMapPosition = true) {
		const mapPosition = convertToMapPosition ? this.map.convertToMapPosition(position) : position;
		const entityId = this.map.getEntityIdAt(mapPosition.x, mapPosition.z);

		return this._monsters.find(x => x.id === entityId);
	}

	private initMap() {
		const result = this._mapLoader.loadMap(this._assetService.assets[MapName].content as HTMLImageElement);
		this.map = result.map;

		const worldMesh = this._worldMeshBuilder.buildWorldMesh(result);
		this.scene.add(worldMesh);
	}

	private initLights() {
		const ambLight = new THREE.AmbientLight(new THREE.Color(0.001, 0.001, 0.001));
		this.scene.add(ambLight);

		const dirLight = new THREE.DirectionalLight(new THREE.Color(0.01, 0.01, 0.01));
		dirLight.position.set(-0.25, 0.5, -0.75).normalize();
		this.scene.add(dirLight);

		this._pointLightCache = this._pointLightCacheFactory();
	}

	private addMonster(position: THREE.Vector3) {
		const monster = this._monsterFactory();
		monster.init(position);

		this._monsters.push(monster);
	}

	dispose() {
		this.scene.traverse((object) => {
			if (object.type === "Mesh") {
				const mesh = object as THREE.Mesh;
				mesh.geometry.dispose();

				if (Array.isArray(mesh.material)) {
					const materials = mesh.material as THREE.Material[];
					materials.forEach(x => x.dispose());
				} else {
					mesh.material.dispose();
				}
			}
		});

		this.scene.dispose();
	}
}
