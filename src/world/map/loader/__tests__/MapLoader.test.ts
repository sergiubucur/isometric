import { loadImage } from "canvas";

import MapLoader from "../MapLoader";
import IMapLoader from "../IMapLoader";
import CellType from "../../CellType";

describe("MapLoader", () => {
	describe("original map", () => {
		let mapFile: any;
		let mapLoader: IMapLoader;

		beforeAll(() => {
			return new Promise((resolve) => {
				loadImage(__dirname + "/map-files/test.png").then((image) => {
					mapFile = image;
					resolve();
				});
			});
		});

		beforeEach(() => {
			mapLoader = new MapLoader();
		});

		it("returns the correct amount of floors, walls and doors", () => {
			const result = mapLoader.loadMap(mapFile);

			const floors = result.rectangles.filter(x => x.type !== CellType.Void && x.type !== CellType.Moving).length;
			const walls = result.edges.length;
			const doors = result.rectangles.filter(x => x.type === CellType.Moving).length;

			expect(floors).toBe(498);
			expect(walls).toBe(268);
			expect(doors).toBe(3);
		});
	});
});
