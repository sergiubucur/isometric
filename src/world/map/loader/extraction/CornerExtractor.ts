import CellType from "../../CellType";
import { getCell } from "./HelperFunctions";

export type Corner = {
	x: number,
	y: number,
	type?: CellType,
	expanded?: boolean
};

export default class CornerExtractor {
	extract(cells: Uint8ClampedArray, size: number): Corner[] {
		const corners = [];

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const c10 = getCell(cells, size, x, y - 1);
				const c01 = getCell(cells, size, x - 1, y);
				const c11 = getCell(cells, size, x, y);
				const c21 = getCell(cells, size, x + 1, y);
				const c12 = getCell(cells, size, x, y + 1);
				const c22 = getCell(cells, size, x + 1, y + 1);

				if (c10 !== c11 && c01 !== c11) {
					corners.push({ x, y, type: c11 });
				}
				if (c21 && c21 !== c11 && c10 !== c11) {
					corners.push({ x: x + 1, y, type: c21 });
				}
				if (c22 && c12 !== c11 && c21 !== c11) {
					corners.push({ x: x + 1, y: y + 1, type: c22 });
				}
				if (c12 && c12 !== c11 && c01 !== c11) {
					corners.push({ x, y: y + 1, type: c12 });
				}
			}
		}

		return corners;
	}
}
