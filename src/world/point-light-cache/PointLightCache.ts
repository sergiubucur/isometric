import * as THREE from "three";

import IPointLightCache, { PointLightCacheItem } from "./IPointLightCache";
import IWorld from "../IWorld";

type Cache = {
	[ key: string ]: {
		free: boolean,
		item: PointLightCacheItem
	}
};

const MaxItems = 10;

export default class PointLightCache implements IPointLightCache {
	private _cache: Cache;

	constructor(private _world: IWorld) {
		this.initCache();
	}

	private initCache() {
		this._cache = {};

		for (let i = 0; i < MaxItems; i++) {
			const item = {
				id: i,
				pointLight: new THREE.PointLight()
			};

			this._cache[item.id] = {
				free: true,
				item
			};

			item.pointLight.intensity = 0;
			this._world.addMesh(item.pointLight);
		}
	}

	allocate(): PointLightCacheItem {
		const item = this.getFreeCacheItem();

		if (!item) {
			return null;
		}

		item.free = false;
		return item.item;
	}

	free(item: PointLightCacheItem) {
		item.pointLight.intensity = 0;
		this._cache[item.id].free = true;
	}

	private getFreeCacheItem() {
		const keys = Object.keys(this._cache);

		for (let i = 0; i < keys.length; i++) {
			const item = this._cache[i];

			if (item.free) {
				return item;
			}
		}

		return null;
	}
}
