import { loadImage } from "canvas";

import MapLoader from "../MapLoader";
import CellType from "../../CellType";

let mapFile: any;

beforeAll(() => {
	return new Promise((resolve) => {
		loadImage(__dirname + "\\map-files\\test.png").then((image) => {
			mapFile = image;
			resolve();
		});
	});
});

test("test.png", () => {
	const mapLoader = new MapLoader();
	const result = mapLoader.loadMap(mapFile);

	const floors = result.rectangles.filter(x => x.type !== CellType.Void && x.type !== CellType.Moving).length;
	const walls = result.edges.length;
	const doors = result.rectangles.filter(x => x.type === CellType.Moving).length;

	expect(floors).toBe(498);
	expect(walls).toBe(268);
	expect(doors).toBe(3);
});
