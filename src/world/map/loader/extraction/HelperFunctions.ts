import { Corner } from "./CornerExtractor";
import Cell from "../../Cell";

export function sortCorners(corners: Corner[], size: number) {
	corners.sort((a, b) => (a.y - b.y) * size + a.x - b.x);
}

export function getCellType(cells: Cell[][], x: number, y: number) {
	const size = cells.length;

	if (x >= 0 && x < size && y >= 0 && y < size) {
		return cells[y][x].type;
	}

	return null;
}
