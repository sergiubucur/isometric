import { Corner } from "./CornerExtractor";
import { Rectangle } from "../IMapLoader";
import { getCell, sortCorners } from "./HelperFunctions";

export default class RectangleExtractor {
	extract(cells: Uint8ClampedArray, size: number, corners: Corner[]) {
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

			this.tryAddCorner(corners, cells, size, rectangle.x1, rectangle.y0);
			this.tryAddCorner(corners, cells, size, rectangle.x1, rectangle.y1);
			this.tryAddCorner(corners, cells, size, rectangle.x0, rectangle.y1);

			sortCorners(corners, size);

			topLeftCorner.expanded = true;
		}

		return rectangles;
	}

	private tryAddCorner(corners: Corner[], cells: Uint8ClampedArray, size: number, x: number, y: number) {
		const cell = getCell(cells, size, x, y);

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
}
