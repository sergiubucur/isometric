import { Rectangle, Edge } from "../IMapLoader";
import CellType from "../../CellType";
import { Corner } from "../extraction/CornerExtractor";

type Color = {
	r: number,
	g: number,
	b: number,
	a: number
};

const CellTypeColorMapping: { [key: number]: Color } = {
	[CellType.Void]: { r: 64, g: 0, b: 0, a: 255 },
	[CellType.Concrete]: { r: 128, g: 0, b: 0, a: 255 },
	[CellType.EmptyFloor]: { r: 192, g: 0, b: 0, a: 255 },
	[CellType.Moving]: { r: 0, g: 128, b: 255, a: 255 }
};

export type DebugRendererOptions = {
	drawCorners: boolean;
	drawRectangles: boolean;
	drawEdges: boolean;
	delay: number;
	cells: Uint8ClampedArray;
	size: number;
	corners: Corner[];
	rectangles: Rectangle[];
	edges: Edge[];
};

export default class DebugRenderer {
	draw(options: DebugRendererOptions) {
		const { size } = options;
		const canvas = this.getCanvas(options.cells, size);
		document.body.appendChild(canvas);

		const ctx = canvas.getContext("2d", { alpha: false });
		const imageData = ctx.getImageData(0, 0, size, size);

		if (options.drawCorners) {
			this.drawCorners(ctx, imageData, size, options.corners);
		}

		if (options.drawRectangles) {
			this.drawRectangles(ctx, imageData, size, options.rectangles, options.delay).then(() => {
				if (this.drawEdges) {
					this.drawEdges(ctx, imageData, size, options.edges, options.delay);
				}
			});
		} else {
			if (options.drawEdges) {
				this.drawEdges(ctx, imageData, size, options.edges, options.delay);
			}
		}
	}

	private drawCorners(ctx: CanvasRenderingContext2D, imageData: ImageData, size: number, corners: Corner[]) {
		corners.forEach(corner => {
			this.putPixel(imageData.data, size, corner.x, corner.y, 0, 255, 0, 255);
		});

		ctx.putImageData(imageData, 0, 0);
	}

	private drawRectangles(ctx: CanvasRenderingContext2D, imageData: ImageData, size: number, rectangles: Rectangle[], delay = 0) {
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

	private drawEdges(ctx: CanvasRenderingContext2D, imageData: ImageData, size: number, edges: Edge[], delay = 0) {
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

	private getCanvas(cells: Uint8ClampedArray, size: number): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		canvas.style.imageRendering = "pixelated";
		canvas.style.width = `${size * 3}px`;
		canvas.style.height = `${size * 3}px`;
		canvas.style.border = "1px solid #404040";
		canvas.style.margin = "8px";
		canvas.style.zIndex = "100";
		canvas.style.position = "absolute";
		canvas.style.left = "0";
		canvas.style.top = "0";

		this.drawCells(canvas, cells, size);

		return canvas;
	}

	private drawCells(canvas: HTMLCanvasElement, cells: Uint8ClampedArray, size: number) {
		const ctx = canvas.getContext("2d", { alpha: false });
		const imageData = ctx.getImageData(0, 0, size, size);
		const data = imageData.data;

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const cell = cells[y * size + x];

				switch (cell) {
					case CellType.Void:
						this.putPixel(data, size, x, y, 0, 0, 0, 255);
						break;

					case CellType.Concrete:
						this.putPixel(data, size, x, y, 64, 64, 64, 255);
						break;

					case CellType.EmptyFloor:
						this.putPixel(data, size, x, y, 255, 255, 255, 255);
						break;

					default:
						break;
				}
			}
		}

		ctx.putImageData(imageData, 0, 0);
	}

	private putPixel(buffer: Uint8ClampedArray, size: number, x: number, y: number, r: number, g: number, b: number, a: number) {
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

				this.putPixel(buffer, size, x, y, color.r, color.g, color.b, color.a);
			}
		}
	}
}
