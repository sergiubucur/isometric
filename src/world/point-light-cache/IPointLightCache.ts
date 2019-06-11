import * as THREE from "three";

export type PointLightCacheItem = {
	id: number,
	pointLight: THREE.PointLight;
};

export default interface IPointLightCache {
	allocate(): PointLightCacheItem;
	free(item: PointLightCacheItem): void;
}
