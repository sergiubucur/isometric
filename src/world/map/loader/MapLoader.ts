import Map from "../Map";
import Cell from "../Cell";
import CellType from "../CellType";
import IMapLoader, { Rectangle, Edge, MapLoaderResult } from "./IMapLoader";

type Color = {
	r: number,
	g: number,
	b: number,
	a: number
};

const ColorCellTypeMapping: { [key: string]: CellType } = {
	"0,0,0": CellType.Void,
	"64,64,64": CellType.Concrete,
	"255,255,255": CellType.EmptyFloor
};

const CellTypeColorMapping: { [key: number]: Color } = {
	[CellType.Void]: { r: 64, g: 0, b: 0, a: 255 },
	[CellType.Concrete]: { r: 128, g: 0, b: 0, a: 255 },
	[CellType.EmptyFloor]: { r: 192, g: 0, b: 0, a: 255 },
};

type Point = {
	x: number,
	y: number
};

type Corner = {
	x: number,
	y: number,
	type?: CellType,
	expanded?: boolean
};

export default class MapLoader implements IMapLoader {
	loadMap(source: HTMLImageElement): MapLoaderResult {
		const data = this.getImageData(source);

		const size = source.width;
		const cells: Cell[][] = [];

		for (let y = 0; y < size; y++) {
			const row: Cell[] = [];

			for (let x = 0; x < size; x++) {
				const cell: Cell = { type: null };

				const i = (y * size + x) * 4;
				const colorStr = `${data[i]},${data[i + 1]},${data[i + 2]}`;
				cell.type = ColorCellTypeMapping[colorStr];

				row.push(cell);
			}

			cells.push(row);
		}

		const { rectangles, edges } = this.getMeshDefinitions(cells);

		return {
			map: new Map(size, cells),
			rectangles,
			edges
		};
	}

	private getMeshDefinitions(cells: Cell[][]): { rectangles: Rectangle[], edges: Edge[] } {
		const size = cells.length;

		const canvas = this.getCanvas(cells);
		// document.body.appendChild(canvas);

		const ctx = canvas.getContext("2d", { alpha: false });
		const imageData = ctx.getImageData(0, 0, size, size);
		const data = imageData.data;

		let rectangles = this.processCells(cells, data);
		let edges = this.getEdges(rectangles);

		// this.debugDrawRectangles(ctx, imageData, size, rectangles, 20).then(() => {
		// 	this.debugDrawEdges(ctx, imageData, size, edges, 20);
		// });

		return {
			rectangles,
			edges
		};
	}

	private debugDrawRectangles(ctx: CanvasRenderingContext2D, imageData: ImageData, size: number, rectangles: Rectangle[], delay = 0) {
		return new Promise((resolve) => {
			const drawRectangle = (i: number) => {
				if (i >= rectangles.length) {
					resolve();
					return;
				}

				this.drawRectangle(imageData.data, size, rectangles[i]);
				ctx.putImageData(imageData, 0, 0);

				setTimeout(() => drawRectangle(i + 1), delay);
			}

			drawRectangle(0);
		});
	}

	private debugDrawEdges(ctx: CanvasRenderingContext2D, imageData: ImageData, size: number, edges: Edge[], delay = 0) {
		return new Promise((resolve) => {
			const drawEdge = (i: number) => {
				if (i >= edges.length) {
					resolve();
					return;
				}

				const edge = edges[i];

				if (edge.type === CellType.Concrete) {
					ctx.strokeStyle = "#ff0000";
				} else {
					ctx.strokeStyle = "#0080ff";
				}

				ctx.beginPath();
				ctx.moveTo(edge.x0, edge.y0);
				ctx.lineTo(edge.x1, edge.y1);
				ctx.stroke();

				setTimeout(() => drawEdge(i + 1), delay);
			}

			drawEdge(0);
		});
	}

	private getCanvas(cells: Cell[][]): HTMLCanvasElement {
		const size = cells.length;

		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		canvas.style.imageRendering = "pixelated";
		canvas.style.width = `${size * 6}px`;
		canvas.style.height = `${size * 6}px`;
		canvas.style.border = "1px solid #404040";
		canvas.style.margin = "8px";
		canvas.style.zIndex = "100";
		canvas.style.position = "absolute";
		canvas.style.left = "0";
		canvas.style.top = "0";

		const ctx = canvas.getContext("2d", { alpha: false });
		const imageData = ctx.getImageData(0, 0, size, size);
		const data = imageData.data;

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const cell = cells[y][x];

				switch (cell.type) {
					case CellType.Void:
						this.debugPutPixel(data, size, x, y, 0, 0, 0, 255);
						break;

					case CellType.Concrete:
						this.debugPutPixel(data, size, x, y, 64, 64, 64, 255);
						break;

					case CellType.EmptyFloor:
						this.debugPutPixel(data, size, x, y, 255, 255, 255, 255);
						break;

					default:
						break;
				}
			}
		}

		ctx.putImageData(imageData, 0, 0);

		return canvas;
	}

	private getEdges(rectangles: Rectangle[]) {
		let edges: Edge[] = [];

		const addEdge = (x0: number, y0: number, x1: number, y1: number, type: CellType, toAdd: Edge[]) => {
			toAdd.push(ensureEdgeDirection({ x0, y0, x1, y1, type }));
		};

		const ensureEdgeDirection = (e: Edge) => {
			if (e.x0 > e.x1) {
				let aux = e.x0;
				e.x0 = e.x1;
				e.x1 = aux;
			}

			if (e.y0 > e.y1) {
				let aux = e.y0;
				e.y0 = e.y1;
				e.y1 = aux;
			}

			return e;
		};

		const splitIntersectingEdges = () => {
			const toAdd: Edge[] = [];
			const toRemove: Edge[] = [];

			for (let i = 0; i < edges.length; i++) {
				const e0 = edges[i];
				const points: Point[] = [];

				for (let j = 0; j < edges.length; j++) {
					if (i === j) {
						continue;
					}

					const e1 = edges[j];

					const notIntersecting = e1.x1 < e0.x0 || e1.x0 > e0.x1 || e1.y1 < e0.y0 || e1.y0 > e0.y1;
					if (notIntersecting) {
						continue;
					}

					const parallel = (e0.x0 === e0.x1 && e1.x0 === e1.x1) || (e0.y0 === e0.y1 && e1.y0 === e1.y1)
					if (parallel) {
						continue;
					}

					const intersectionPointIsEdgeVertex = (e0.x0 === e1.x0 && e0.y0 === e1.y0) || (e0.x1 === e1.x1 && e0.y1 === e1.y1)
						|| (e0.x1 === e1.x0 && e0.y1 === e1.y0) || (e0.x0 === e1.x1 && e0.y0 === e1.y1);
					if (intersectionPointIsEdgeVertex) {
						continue;
					}

					if ((e0.x0 < e1.x0 && e1.x0 < e0.x1) || (e0.y0 < e1.y0 && e1.y0 < e0.y1)) {
						if (!points.find(p => p.x === e1.x0 && p.y === e1.y0)) {
							points.push({ x: e1.x0, y: e1.y0 });
						}
					}
				}

				if (points.length > 0) {
					toRemove.push(e0);

					if (e0.x0 < e0.x1) {
						points.sort((a, b) => a.x - b.x);

						let p0 = { x: e0.x0, y: e0.y0 };
						let p1;

						for (let i = 0; i < points.length; i++) {
							p1 = points[i];
							addEdge(p0.x, p0.y, p1.x, p1.y, e0.type, toAdd);
							p0 = p1;
						}

						addEdge(p1.x, p1.y, e0.x1, e0.y1, e0.type, toAdd);
					}
				}
			}

			edges = edges.filter(x => !toRemove.find(y => y === x));
			edges.push(...toAdd);
		}

		const edgeVerticesEquals = (e0: Edge, e1: Edge) => {
			return (e0.x0 === e1.x0 && e0.y0 === e1.y0 && e0.x1 === e1.x1 && e0.y1 === e1.y1)
				|| (e0.x0 === e1.x1 && e0.y0 === e1.y1 && e0.x1 === e1.x0 && e0.y1 === e1.y0);
		};

		const reduceToCommonEdges = () => {
			const commonEdges: Edge[] = [];

			for (let i = 0; i < edges.length; i++) {
				const e0 = edges[i];

				for (let j = 0; j < edges.length; j++) {
					if (i === j) {
						continue;
					}

					const e1 = edges[j];

					if (e0.type !== e1.type && edgeVerticesEquals(e0, e1)) {
						if (e0.type === CellType.Concrete) {
							const index = commonEdges.findIndex(e => edgeVerticesEquals(e, e1));

							if (index > -1) {
								commonEdges.splice(index, 1);
							}

							commonEdges.push(e0);
						} else {
							if (e0.type === CellType.EmptyFloor) {
								if (!commonEdges.find(e => edgeVerticesEquals(e, e1))) {
									commonEdges.push(e0);
								}
							}
						}
					}
				}
			}

			edges = commonEdges;
		};

		rectangles.forEach(r => {
			addEdge(r.x0, r.y0, r.x1, r.y0, r.type, edges);
			addEdge(r.x1, r.y0, r.x1, r.y1, r.type, edges);
			addEdge(r.x1, r.y1, r.x0, r.y1, r.type, edges);
			addEdge(r.x0, r.y1, r.x0, r.y0, r.type, edges);
		});

		splitIntersectingEdges();
		reduceToCommonEdges();

		return edges;
	}

	private debugPutPixel(buffer: Uint8ClampedArray, size: number, x: number, y: number, r: number, g: number, b: number, a: number) {
		const i = (y * size + x) * 4;

		buffer[i] = r;
		buffer[i + 1] = g;
		buffer[i + 2] = b;
		buffer[i + 3] = a;
	}

	private drawRectangle(buffer: Uint8ClampedArray, size: number, rectangle: Rectangle) {
		const color = CellTypeColorMapping[rectangle.type];

		for (let y = rectangle.y0; y < rectangle.y1; y++) {
			for (let x = rectangle.x0; x < rectangle.x1; x++) {
				if (x > rectangle.x0 && x < rectangle.x1 - 1 && y > rectangle.y0 && y < rectangle.y1 - 1) {
					continue;
				}

				this.debugPutPixel(buffer, size, x, y, color.r, color.g, color.b, color.a);
			}
		}
	}

	private processCells(cells: Cell[][], buffer: Uint8ClampedArray) {
		const size = cells.length;
		const corners = this.getCorners(cells);

		// corners.forEach(corner => {
		// 	this.putPixel(buffer, size, corner.x, corner.y, 0, 255, 0, 255);
		// });
		this.sortCorners(corners, size);

		return this.getRectangles(cells, corners);
	}

	private sortCorners(corners: Corner[], size: number) {
		corners.sort((a, b) => (a.y - b.y) * size + a.x - b.x);
	}

	private getCellType(cells: Cell[][], x: number, y: number) {
		const size = cells.length;

		if (x >= 0 && x < size && y >= 0 && y < size) {
			return cells[y][x].type;
		}

		return null;
	}

	private getCorners(cells: Cell[][]): Corner[] {
		const size = cells.length;
		const corners = [];

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const c00 = this.getCellType(cells, x - 1, y - 1);
				const c10 = this.getCellType(cells, x, y - 1);
				const c20 = this.getCellType(cells, x + 1, y - 1);
				const c01 = this.getCellType(cells, x - 1, y);
				const c11 = this.getCellType(cells, x, y);
				const c21 = this.getCellType(cells, x + 1, y);
				const c02 = this.getCellType(cells, x - 1, y + 1);
				const c12 = this.getCellType(cells, x, y + 1);
				const c22 = this.getCellType(cells, x + 1, y + 1);

				if (c00 === c10 && c00 === c01 && c00 !== c11) {
					corners.push({ x, y, type: c11 });
				}
				if (c21 && c20 === c10 && c20 === c21 && c20 !== c11) {
					corners.push({ x: x + 1, y, type: c21 });
				}
				if (c22 && c22 === c21 && c22 === c12 && c22 !== c11) {
					corners.push({ x: x + 1, y: y + 1, type: c22 });
				}
				if (c12 && c02 === c01 && c02 === c12 && c02 !== c11) {
					corners.push({ x, y: y + 1, type: c12 });
				}
			}
		}

		return corners;
	}

	private getRectangles(cells: Cell[][], corners: Corner[]) {
		const size = cells.length;
		const rectangles: Rectangle[] = [];

		while (true) {
			let topLeftCorner = corners.find(c => !c.expanded);
			if (!topLeftCorner) {
				break;
			}

			let bottomRightCorner = this.getBottomRightCorner(corners, size, topLeftCorner);

			const rectangle = {
				x0: topLeftCorner.x,
				x1: bottomRightCorner.x + 1,
				y0: topLeftCorner.y,
				y1: bottomRightCorner.y + 1,
				type: topLeftCorner.type
			};

			rectangles.push(rectangle);

			this.tryAddCorner(corners, cells, rectangle.x1, rectangle.y0);
			this.tryAddCorner(corners, cells, rectangle.x1, rectangle.y1);
			this.tryAddCorner(corners, cells, rectangle.x0, rectangle.y1);

			this.sortCorners(corners, size);

			topLeftCorner.expanded = true;
		}

		return rectangles;
	}

	private tryAddCorner(corners: Corner[], cells: Cell[][], x: number, y: number) {
		const cell = this.getCellType(cells, x, y);

		if (cell && !corners.find(c => c.x === x && c.y === y)) {
			corners.push({ x, y, type: cell });
		}
	}

	private getBottomRightCorner(corners: Corner[], size: number, topLeftCorner: Corner) {
		const rightCorner = corners.find(c => c.x > topLeftCorner.x && c.y === topLeftCorner.y);
		const x = rightCorner ? rightCorner.x - 1 : size - 1;

		const bottomCorner = corners.find(c => c.y > topLeftCorner.y);
		const y = bottomCorner ? bottomCorner.y - 1 : size - 1;

		return { x, y };
	}

	private getImageData(image: HTMLImageElement): Uint8ClampedArray {
		const canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		const ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);
		const imageData = ctx.getImageData(0, 0, image.width, image.height);

		return imageData.data;
	}
}
