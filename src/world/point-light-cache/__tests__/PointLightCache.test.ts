import PointLightCache from "../PointLightCache";

describe("PointLightCache", () => {
	let world: any;
	let pointLightCache: PointLightCache;

	beforeEach(() => {
		world = { addMesh: () => {} };
		pointLightCache = new PointLightCache(world);
	});

	it("should provide a valid PointLightCacheItem", () => {
		const pointLightCacheItem = pointLightCache.allocate();

		expect(pointLightCacheItem).toBeTruthy();
		expect(pointLightCacheItem.id).toBeGreaterThan(0);
	});
});
