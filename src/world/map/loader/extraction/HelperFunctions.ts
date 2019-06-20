import { Corner } from "./CornerExtractor";

export function sortCorners(corners: Corner[], size: number) {
	corners.sort((a, b) => (a.y - b.y) * size + a.x - b.x);
}

export function getCell(cells: Uint8ClampedArray, size: number, x: number, y: number) {
	if (x >= 0 && x < size && y >= 0 && y < size) {
		return cells[y * size + x];
	}

	return null;
}
