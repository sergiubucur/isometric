import * as THREE from "three";

import IProjectile from "./IProjectile";
import IEntityMovementEngine from "../engine/movement/IEntityMovementEngine";
import ProjectileData from "./ProjectileData";
import IEntityId from "../entity-id/IEntityId";
import IWorld from "../../world/IWorld";
import IPointLightCache, { PointLightCacheItem } from "../../world/point-light-cache/IPointLightCache";
import IPrimitiveCache from "../../world/primitive-cache/IPrimitiveCache";

const Size = 1;
const MeshRadius = 0.5;
const YOffset = 2;
const ExplosionAnimationTotalFrames = 10;
const FadeInAnimationTotalFrames = 3;
const GeometryCacheKey = "Projectile";

export default class Projectile implements IProjectile {
	id: number;
	toBeDeleted: boolean;

	private _mesh: THREE.Mesh;
	private _data: ProjectileData;
	private _exploded: boolean;
	private _explosionAnimationFrames: number;
	private _fadeInAnimationFrames: number;
	private _pointLightCacheItem: PointLightCacheItem;
	private _geometry: THREE.SphereBufferGeometry;

	constructor(private _world: IWorld, private _entityId: IEntityId, private _movementEngine: IEntityMovementEngine,
		private _pointLightCache: IPointLightCache, private _primitiveCache: IPrimitiveCache) {

		this.id = this._entityId.getNewId();
		this.toBeDeleted = false;
		this._explosionAnimationFrames = ExplosionAnimationTotalFrames;
		this._fadeInAnimationFrames = FadeInAnimationTotalFrames;
		this._geometry = this._primitiveCache.getGeometry(GeometryCacheKey, () => new THREE.SphereBufferGeometry(MeshRadius));
	}

	init(data: ProjectileData) {
		this._data = data;

		this._movementEngine.setProjectileMode(true, this._data.originEntityId, () => this.handleHit());
		this._movementEngine.init(this.id, data.startPosition, Size, data.speed);
		this._movementEngine.afterPositionUpdate = () => {
			this.updateMeshPosition();
		};

		this.initMesh();

		this._movementEngine.startMovingTo(this._data.targetPosition);
	}

	update() {
		if (this._exploded) {
			this._mesh.visible = true;

			if (this._explosionAnimationFrames > 0) {
				this._explosionAnimationFrames--;

				const value = this._explosionAnimationFrames / ExplosionAnimationTotalFrames;
				const scale = Size + (this._data.splashRadius - Size) * (1 - value);

				this._mesh.scale.set(scale, scale, scale);

				if (this._pointLightCacheItem) {
					this._pointLightCacheItem.pointLight.distance = (2 - value) * this._data.splashRadius;
				}

				if (this._explosionAnimationFrames === 0) {
					this.toBeDeleted = true;
				}
			}

			return;
		}

		if (this._fadeInAnimationFrames > 0) {
			this._fadeInAnimationFrames--;

			if (this._fadeInAnimationFrames === 0) {
				this._mesh.visible = true;
			}
		}

		this._movementEngine.move();
	}

	dispose() {
		if (this._pointLightCacheItem) {
			this._pointLightCache.free(this._pointLightCacheItem);
		}

		this._world.removeMesh(this._mesh);
		this._mesh = null;
	}

	private handleHit() {
		this._world.areaDamage(this._movementEngine.position, this._data.splashRadius, this._data.originEntityId);

		this._movementEngine.stop();
		this._exploded = true;
	}

	private initMesh() {
		const material = new THREE.MeshPhongMaterial({ color: this._data.color });
		material.emissive.set(this._data.color);
		material.emissiveIntensity = 3;

		this._mesh = new THREE.Mesh(this._geometry, material);
		this._mesh.visible = false;

		this._pointLightCacheItem = this._pointLightCache.allocate();
		if (this._pointLightCacheItem) {
			this._pointLightCacheItem.pointLight.intensity = 3;
			this._pointLightCacheItem.pointLight.distance = this._data.splashRadius;
			this._pointLightCacheItem.pointLight.color.set(this._data.color);
		}

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	private updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
		this._mesh.position.y += YOffset;

		if (this._pointLightCacheItem) {
			this._pointLightCacheItem.pointLight.position.copy(this._movementEngine.position);
			this._pointLightCacheItem.pointLight.position.y += YOffset;
		}
	}
}
