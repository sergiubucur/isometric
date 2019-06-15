import * as THREE from "three";

import IPrimitiveCache from "./IPrimitiveCache";

export default class PrimitiveCache implements IPrimitiveCache {
	private _geometry: { [key: string]: THREE.BufferGeometry; };
	private _material: { [key: string]: THREE.Material; };

	constructor() {
		this._geometry = {};
		this._material = {};
	}

	getGeometry<T extends THREE.BufferGeometry>(key: string, factory: () => T): T {
		if (!this._geometry[key]) {
			this._geometry[key] = factory();
		}

		return this._geometry[key] as T;
	}

	getMaterial<T extends THREE.Material>(key: string, factory: () => T): T {
		if (!this._material[key]) {
			this._material[key] = factory();
		}

		return this._material[key] as T;
	}

	dispose() {
		Object.keys(this._geometry).forEach(key => {
			this._geometry[key].dispose();
		});
		this._geometry = null;

		Object.keys(this._material).forEach(key => {
			this._material[key].dispose();
		});
		this._material = null;
	}
}
