import Map from "../Map";
import Cell from "../Cell";
import CellType from "../CellType";
import IMapLoader from "./IMapLoader";

export default class MapLoader implements IMapLoader {
	loadMap(source: string): Map {
		const data = source.split("\n").filter(x => x.length > 0);

		const size = data.length;
		const cells = [];

		for (let y = 0; y < size; y++) {
			const row = [];

			for (let x = 0; x < size * 2; x += 2) {
				const cellStr = data[y].substr(x, 2);
				const cell: Cell = { type: null };

				switch (cellStr) {
					case "..":
						cell.type = CellType.Void;
						break;

					case "AB":
						cell.type = CellType.EmptyFloor;
						break;

					default:
						throw new Error("invalid cell");
				}

				row.push(cell);
			}

			cells.push(row);
		}

		return new Map(size, cells);
	}
}
