import CellType from "../../CellType";
import { Edge, Rectangle } from "../IMapLoader";

type Point = {
	x: number,
	y: number
};

export default class EdgeExtractor {
	extract(rectangles: Rectangle[], removeOccludedEdges: boolean) {
		let edges: Edge[] = [];

		rectangles.forEach(r => {
			this.addEdge(r.x0, r.y0, r.x1, r.y0, r.type, edges);
			this.addEdge(r.x1, r.y0, r.x1, r.y1, r.type, edges);
			this.addEdge(r.x1, r.y1, r.x0, r.y1, r.type, edges);
			this.addEdge(r.x0, r.y1, r.x0, r.y0, r.type, edges);
		});

		edges = this.splitIntersectingEdges(edges);
		edges = this.reduceToCommonEdges(edges);

		if (removeOccludedEdges) {
			edges = this.removeOccludedEdges(edges, rectangles);
		}

		return edges;
	}

	private edgeVerticesEquals(e0: Edge, e1: Edge) {
		return (e0.x0 === e1.x0 && e0.y0 === e1.y0 && e0.x1 === e1.x1 && e0.y1 === e1.y1)
			|| (e0.x0 === e1.x1 && e0.y0 === e1.y1 && e0.x1 === e1.x0 && e0.y1 === e1.y0);
	}

	private reduceToCommonEdges(edges: Edge[]) {
		const commonEdges: Edge[] = [];

		for (let i = 0; i < edges.length; i++) {
			const e0 = edges[i];

			for (let j = 0; j < edges.length; j++) {
				if (i === j) {
					continue;
				}

				const e1 = edges[j];

				if (e0.type !== e1.type && this.edgeVerticesEquals(e0, e1)) {
					if (e0.type === CellType.Concrete) {
						const index = commonEdges.findIndex(e => this.edgeVerticesEquals(e, e1));

						if (index > -1) {
							commonEdges.splice(index, 1);
						}

						commonEdges.push(e0);
					} else {
						if (e0.type === CellType.EmptyFloor) {
							if (!commonEdges.find(e => this.edgeVerticesEquals(e, e1))) {
								commonEdges.push(e0);
							}
						}
					}
				}
			}
		}

		return commonEdges;
	};

	private splitIntersectingEdges(edges: Edge[]) {
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
						this.addEdge(p0.x, p0.y, p1.x, p1.y, e0.type, toAdd);
						p0 = p1;
					}

					this.addEdge(p1.x, p1.y, e0.x1, e0.y1, e0.type, toAdd);
				}
			}
		}

		const result = edges.filter(x => !toRemove.find(y => y === x));
		result.push(...toAdd);

		return result;
	}

	private edgeEqualsReverseDirection(e0: Edge, e1: Edge) {
		return e0.type === e1.type && e0.x0 === e1.x1 && e0.y0 === e1.y1 && e0.x1 === e1.x0 && e0.y1 === e1.y0;
	}

	private removeOccludedEdges(edges: Edge[], rectangles: Rectangle[]) {
		const toKeep: Edge[] = [];

		edges.forEach(edge => {
			if (edge.type !== CellType.Concrete) {
				return;
			}

			for (let i = 0; i < rectangles.length; i++) {
				const r = rectangles[i];

				if (this.edgeEqualsReverseDirection(edge, this.constructEdge(r.x1, r.y1, r.x0, r.y1, r.type))
					|| this.edgeEqualsReverseDirection(edge, this.constructEdge(r.x0, r.y1, r.x0, r.y0, r.type))) {

					toKeep.push(edge);
					break;
				}
			}
		});

		return edges.filter(x => x.type !== CellType.Concrete || toKeep.find(y => y === x));
	}

	private constructEdge(x0: number, y0: number, x1: number, y1: number, type: CellType) {
		return { x0, y0, x1, y1, type };
	}

	private addEdge(x0: number, y0: number, x1: number, y1: number, type: CellType, toAdd: Edge[]) {
		toAdd.push(this.ensureEdgeDirection({ x0, y0, x1, y1, type }));
	}

	private ensureEdgeDirection(e: Edge) {
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
	}
}
