import * as THREE from "three";

import PrimitiveCache from "../PrimitiveCache";
import IPrimitiveCache from "../IPrimitiveCache";

describe("PrimitiveCache", () => {
	let primitiveCache: IPrimitiveCache;

	beforeEach(() => {
		primitiveCache = new PrimitiveCache();
	});

	describe("geometry", () => {
		it("returns a different result per cache key", () => {
			const CacheKey1 = "A";
			const CacheKey2 = "B";

			const item1 = primitiveCache.getGeometry(CacheKey1, () => new THREE.BufferGeometry());
			const item2 = primitiveCache.getGeometry(CacheKey2, () => new THREE.BufferGeometry());

			expect(item1).not.toStrictEqual(item2);
		});

		it("returns the same result if called with the same cache key", () => {
			const CacheKey = "A";

			const item1 = primitiveCache.getGeometry(CacheKey, () => new THREE.BufferGeometry());
			const item2 = primitiveCache.getGeometry(CacheKey, () => new THREE.BufferGeometry());

			expect(item1).toStrictEqual(item2);
		});
	});

	describe("material", () => {
		it("returns a different result per cache key", () => {
			const CacheKey1 = "A";
			const CacheKey2 = "B";

			const item1 = primitiveCache.getMaterial(CacheKey1, () => new THREE.Material());
			const item2 = primitiveCache.getMaterial(CacheKey2, () => new THREE.Material());

			expect(item1).not.toStrictEqual(item2);
		});

		it("returns the same result if called with the same cache key", () => {
			const CacheKey = "A";

			const item1 = primitiveCache.getMaterial(CacheKey, () => new THREE.Material());
			const item2 = primitiveCache.getMaterial(CacheKey, () => new THREE.Material());

			expect(item1).toStrictEqual(item2);
		});
	});
});
