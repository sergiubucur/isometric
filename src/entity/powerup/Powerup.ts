import * as THREE from "three";

import IPowerup from "./IPowerup";
import IWorld from "../../world/IWorld";
import IEntityId from "../entity-id/IEntityId";
import IPrimitiveCache from "../../world/primitive-cache/IPrimitiveCache";
import PowerupType from "./PowerupType";
import MapMatrixType from "../../world/map/MapMatrixType";

const PowerupInfo = {
	[PowerupType.Health]: {
		materialCacheKey: "PowerupHealth",
		color: "#ff0000"
	},
	[PowerupType.Mana]: {
		materialCacheKey: "PowerupMana",
		color: "#0080ff"
	}
};

const GeometryCacheKey = "Powerup";
const MapSize = 2;
const MeshSize = 0.5;
const YOffset = 2;

export default class Powerup implements IPowerup {
	readonly id: number;
	toBeDeleted: boolean;
	readonly size: number;
	type: PowerupType;

	private _mesh: THREE.Mesh;
	private _geometry: THREE.BufferGeometry;
	private _material: THREE.MeshPhongMaterial;
	private _position: THREE.Vector3;
	private _angle: number;

	constructor(private _world: IWorld, private _entityId: IEntityId, private _primitiveCache: IPrimitiveCache) {
		this.id = this._entityId.getNewId();
		this.toBeDeleted = false;
		this.size = MapSize;
		this._position = new THREE.Vector3();
		this._angle = 0;
	}

	init(type: PowerupType, position: THREE.Vector3) {
		this.type = type;

		const info = PowerupInfo[type];

		this._position.copy(position);
		this._geometry = this._primitiveCache.getGeometry(GeometryCacheKey, () => new THREE.TorusKnotBufferGeometry());
		this._material = this._primitiveCache.getMaterial(info.materialCacheKey, () => new THREE.MeshPhongMaterial({ color: info.color }));

		this.initMesh();
		this.modifyCells(true);
	}

	update() {
		this._angle += 0.1;

		this._mesh.rotation.y += 0.05;
		this._mesh.position.y = YOffset + 0.5 * Math.sin(this._angle);
	}

	dispose() {
		this.modifyCells(false);

		this._world.removeMesh(this._mesh);
		this._mesh = null;
	}

	occupyMapCells() {
		this.modifyCells(true);
	}

	markForDeletion() {
		this.toBeDeleted = true;
	}

	private initMesh() {
		this._mesh = new THREE.Mesh(this._geometry, this._material);
		this._mesh.scale.set(MeshSize, MeshSize, MeshSize);
		this._mesh.rotation.order = "ZYX";

		this._mesh.position.copy(this._position);
		this._mesh.position.y += YOffset;

		this._world.addMesh(this._mesh);
	}

	private modifyCells(occupy?: boolean) {
		const radius = this.size / 2;

		const p0 = this._position.clone();
		p0.x -= radius;
		p0.z -= radius;

		const c0 = this._world.map.convertToMapPosition(p0);

		const p1 = this._position.clone();
		p1.x += radius;
		p1.z += radius;

		const c1 = this._world.map.convertToMapPosition(p1);

		for (let x = c0.x; x <= c1.x; x++) {
			for (let z = c0.z; z <= c1.z; z++) {
				if (occupy) {
					if (this._world.map.getCell(x, z)) {
						this._world.map.occupyCell(x, z, this.id, MapMatrixType.Powerup);
					}
				} else {
					if (this._world.map.getCell(x, z)) {
						this._world.map.vacateCell(x, z, MapMatrixType.Powerup);
					}
				}
			}
		}
	}
}
