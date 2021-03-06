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
import IPrimitiveCache from "./primitive-cache/IPrimitiveCache";
import DisposalHelper from "../common/DisposalHelper";
import IDoor from "../entity/door/IDoor";
import CellType from "./map/CellType";
import IPowerup from "../entity/powerup/IPowerup";
import PowerupType from "../entity/powerup/PowerupType";
import MapMatrixType from "./map/MapMatrixType";

const MapName = "testMap";

export default class World implements IWorld, IWorldComponent {
	get totalMonsters() {
		return this._monsters.length;
	}

	readonly scene: THREE.Scene;
	map: IMap;

	private _monsters: IMonster[];
	private _projectiles: IProjectile[];
	private _doors: IDoor[];
	private _powerups: IPowerup[];
	private _player: IPlayer;
	private _pointLightCache: IPointLightCache;

	constructor(private _assetService: IAssetService, private _mapLoader: IMapLoader, private _worldMeshBuilder: IWorldMeshBuilder,
		private _monsterFactory: () => IMonster, private _projectileFactory: () => IProjectile, private _logger: ILogger,
		private _pointLightCacheFactory: () => IPointLightCache, private _primitiveCache: IPrimitiveCache,
		private _doorFactory: () => IDoor, private _powerupFactory: () => IPowerup) {

		this.scene = new THREE.Scene();
		this._monsters = [];
		this._projectiles = [];
		this._doors = [];
		this._powerups = [];
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
		this._doors.forEach(x => x.update());
		this._monsters.forEach(x => x.update());

		this._projectiles.forEach(x => {
			if (!x.toBeDeleted) {
				x.update();
			}
		});

		this._powerups.forEach(x => {
			if (!x.toBeDeleted) {
				x.update();
			}
		});

		this._player.update();

		this.deleteMarkedEntities();

		const mapEntities = this._monsters.length + this._projectiles.length + this._doors.length + this._powerups.length + 1;
		this._logger.logNumber("map entities", mapEntities, 0);
	}

	deleteMarkedEntities() {
		this._projectiles.filter(x => x.toBeDeleted).forEach(x => x.dispose());
		this._projectiles = this._projectiles.filter(x => !x.toBeDeleted);

		const powerupsToDelete = this._powerups.filter(x => x.toBeDeleted);
		if (powerupsToDelete.length > 0) {
			powerupsToDelete.forEach(x => x.dispose());
			this._powerups = this._powerups.filter(x => !x.toBeDeleted);
			this._powerups.forEach(x => x.occupyMapCells());
		}
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

		if (originId === this._player.id) {
			entityIds.forEach(id => {
				const monster = this._monsters.find(x => x.id === id);

				if (monster && monster.id !== originId) {
					monster.damage();
				}
			});
		} else {
			if (entityIds.indexOf(this._player.id) > -1) {
				this._player.damage();
			}
		}
	}

	addProjectile(data: ProjectileData) {
		const projectile = this._projectileFactory();
		projectile.init(data);

		this._projectiles.push(projectile);
	}

	addPowerup(position: THREE.Vector3, type: PowerupType) {
		const powerup = this._powerupFactory();
		powerup.init(type, position);

		this._powerups.push(powerup);
	}

	initEntities() {
		this.initMonsters();
	}

	private initMonsters() {
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
	}

	getEntityAtPosition(position: THREE.Vector3, convertToMapPosition = true) {
		const mapPosition = convertToMapPosition ? this.map.convertToMapPosition(position) : position;
		const entityId = this.map.getEntityIdAt(mapPosition.x, mapPosition.z);

		const monster = this._monsters.find(x => x.id === entityId);
		if (monster) {
			return monster;
		}

		const door = this._doors.find(x => x.id === entityId);
		if (door) {
			return door;
		}

		return null;
	}

	getPowerupsInArea(position: THREE.Vector3, radius: number) {
		const mapPosition = this.map.convertToMapPosition(position);
		const entityIds = this.map.getAllEntityIdsInArea(mapPosition.x, mapPosition.z, radius, MapMatrixType.Powerup);

		return this._powerups.filter(x => !x.toBeDeleted && entityIds.find(y => y === x.id));
	}

	private initMap() {
		const result = this._mapLoader.loadMap(this._assetService.assets[MapName].content as HTMLImageElement);
		this.map = result.map;

		const worldMesh = this._worldMeshBuilder.buildWorldMesh(result);
		this.scene.add(worldMesh);

		result.rectangles.filter(x => x.type === CellType.Moving).forEach(x => {
			const door = this._doorFactory();
			door.init(x, this._worldMeshBuilder.getMovingMesh(x));

			this._doors.push(door);
		});

		console.log("doors", this._doors.length);
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
		this._primitiveCache.dispose();
		this._worldMeshBuilder.dispose();

		DisposalHelper.disposeObject3D(this.scene);
		this.scene.dispose();
	}
}
