import { Rectangle, Edge } from "../IMapLoader";
import CellType from "../../CellType";

export default class RectangleFilter {
	filter(rectangles: Rectangle[]) {
		this.removeDuplicateRectangles(rectangles);
		this.mergeAdjacentMovingRectangles(rectangles);
	}

	private removeDuplicateRectangles(rectangles: Rectangle[]) {
		let i = 0;
		while (i < rectangles.length) {
			const r0 = rectangles[i];

			if (rectangles.find(r1 => r0 !== r1 && r0.x0 === r1.x0 && r0.y0 === r1.y0 && r0.x1 === r1.x1 && r0.y1 === r1.y1)) {
				rectangles.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	private mergeAdjacentMovingRectangles(rectangles: Rectangle[]) {
		const output: Rectangle = { x0: 0, y0: 0, x1: 0, y1: 0, type: CellType.Void };

		for (let i = 0; i < rectangles.length; i++) {
			const r0 = rectangles[i];

			if (r0.type !== CellType.Moving) {
				continue;
			}

			const index = rectangles.findIndex(r1 => r0 !== r1 && r0.type === r1.type && this.canMergeRectangles(r0, r1, output));
			if (index > -1) {
				this.rectangleCopy(r0, output);
				rectangles.splice(index, 1);
			}
		}
	}

	private canMergeRectangles(r0: Rectangle, r1: Rectangle, output: Rectangle) {
		const edges0 = this.getRectangleEdges(r0);
		const edges1 = this.getRectangleEdges(r1);

		if (this.edgeEqualsReverse(edges0[0], edges1[2]) || this.edgeEqualsReverse(edges0[3], edges1[1])) {
			output.x0 = r1.x0;
			output.y0 = r1.y0;
			output.x1 = r0.x1;
			output.y1 = r0.y1;
			output.type = r0.type;

			return true;
		}
		if (this.edgeEqualsReverse(edges0[1], edges1[3]) || this.edgeEqualsReverse(edges0[2], edges1[0])) {
			output.x0 = r0.x0;
			output.y0 = r0.y0;
			output.x1 = r1.x1;
			output.y1 = r1.y1;
			output.type = r0.type;

			return true;
		}

		return false;
	}

	private rectangleCopy(r0: Rectangle, r1: Rectangle) {
		r0.x0 = r1.x0;
		r0.y0 = r1.y0;
		r0.x1 = r1.x1;
		r0.y1 = r1.y1;
		r0.type = r1.type;
	}

	private getRectangleEdges(r: Rectangle): Edge[] {
		const edges: Edge[] = [];

		edges.push({ x0: r.x0, y0: r.y0, x1: r.x1, y1: r.y0, type: r.type });
		edges.push({ x0: r.x1, y0: r.y0, x1: r.x1, y1: r.y1, type: r.type });
		edges.push({ x0: r.x1, y0: r.y1, x1: r.x0, y1: r.y1, type: r.type });
		edges.push({ x0: r.x0, y0: r.y1, x1: r.x0, y1: r.y0, type: r.type });

		return edges;
	}

	private edgeEqualsReverse(e0: Edge, e1: Edge) {
		return e0.x0 === e1.x1 && e0.y0 === e1.y1 && e0.x1 === e1.x0 && e0.y1 === e1.y0;
	}
}
