import { IMock, Mock, It, Times } from "typemoq";

import PointLightCache, { MaxItems } from "../PointLightCache";
import IWorld from "../../IWorld";

describe("PointLightCache", () => {
	let world: IMock<IWorld>;
	let pointLightCache: PointLightCache;

	beforeEach(() => {
		world = Mock.ofType<IWorld>();

		pointLightCache = new PointLightCache(world.object);
	});

	it("returns a valid PointLightCacheItem", () => {
		const pointLightCacheItem = pointLightCache.allocate();

		expect(pointLightCacheItem).toBeTruthy();
		expect(pointLightCacheItem.id).toBeGreaterThan(0);
	});

	it(`calls IWorld.addMesh ${MaxItems} times`, () => {
		expect(world.verify(x => x.addMesh(It.isAny()), Times.exactly(MaxItems)));
	});

	it("returns valid items while under the limit, and null items after the limit is exceeded", () => {
		let pointLightCacheItem;

		for (let i = 0; i < MaxItems; i++) {
			pointLightCacheItem = pointLightCache.allocate();
			expect(pointLightCacheItem).toBeTruthy();
		}

		pointLightCacheItem = pointLightCache.allocate();
		expect(pointLightCacheItem).toBe(null);
	});

	it("correctly frees items", () => {
		const items = [];

		for (let i = 0; i < MaxItems; i++) {
			items.push(pointLightCache.allocate());
		}

		items.forEach(x => pointLightCache.free(x));

		for (let i = 0; i < MaxItems; i++) {
			let pointLightCacheItem = pointLightCache.allocate();
			expect(pointLightCacheItem).toBeTruthy();
		}
	});
});
