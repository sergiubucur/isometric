import Map from "../Map";
import Cell from "../Cell";
import CellType from "../CellType";
import IMapLoader, { Rectangle, Edge, MapLoaderResult } from "./IMapLoader";
import CornerExtractor, { Corner } from "./extraction/CornerExtractor";
import { sortCorners } from "./extraction/HelperFunctions";
import RectangleExtractor from "./extraction/RectangleExtractor";
import CellExtractor from "./extraction/CellExtractor";
import RectangleFilter from "./extraction/RectangleFilter";
import EdgeExtractor from "./extraction/EdgeExtractor";
import DebugRenderer from "./debug-renderer/DebugRenderer";

const DrawResult = false;

export default class MapLoader implements IMapLoader {
	loadMap(source: HTMLImageElement): MapLoaderResult {
		const cells = new CellExtractor().extract(source);
		const { corners, rectangles, edges } = this.getPrimitives(cells);

		if (DrawResult) {
			this.drawResult(cells, corners, rectangles, edges);
		}

		return {
			map: new Map(cells.length, cells),
			rectangles,
			edges
		};
	}

	private drawResult(cells: Cell[][], corners: Corner[], rectangles: Rectangle[], edges: Edge[]) {
		const debugRenderer = new DebugRenderer();

		debugRenderer.draw({
			drawCorners: false,
			drawRectangles: false,
			drawEdges: true,
			delay: 0,
			cells,
			corners,
			rectangles,
			edges
		});
	}

	private getPrimitives(cells: Cell[][]) {
		const corners = new CornerExtractor().extract(cells);
		sortCorners(corners, cells.length);

		const rectangles = new RectangleExtractor().extract(cells, [...corners]);

		this.maskRectangles(rectangles);

		const removeOccludedEdges = true; // reduces edge count but prunes too much in certain cases
		const edges = new EdgeExtractor().extract(rectangles, removeOccludedEdges);

		this.unmaskRectangles(rectangles);

		const rectangleFilter = new RectangleFilter();
		rectangleFilter.filter(rectangles);

		return {
			corners,
			rectangles,
			edges
		};
	}

	private maskRectangles(rectangles: Rectangle[]) {
		rectangles.forEach(x => {
			if (x.type === CellType.Moving) {
				x.type = CellType.EmptyFloor;
				x.originalType = CellType.Moving;
			}
		});
	}

	private unmaskRectangles(rectangles: Rectangle[]) {
		rectangles.forEach(x => {
			if (x.originalType) {
				x.type = x.originalType;
				x.originalType = undefined;
			}
		});
	}
}
