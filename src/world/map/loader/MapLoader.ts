import Map from "../Map";
import Cell from "../Cell";
import CellType from "../CellType";
import IMapLoader from "./IMapLoader";

const ColorCellTypeMapping: { [key: string]: CellType } = {
	"0,0,0": CellType.Void,
	"64,64,64": CellType.Concrete,
	"255,255,255": CellType.EmptyFloor
};

export default class MapLoader implements IMapLoader {
	loadMap(source: HTMLImageElement): Map {
		const data = this.getImageData(source);

		const size = source.width;
		const cells = [];

		for (let y = 0; y < size; y++) {
			const row = [];

			for (let x = 0; x < size; x++) {
				const cell: Cell = { type: null };

				const i = (y * size + x) * 4;
				const colorStr = `${data[i]},${data[i + 1]},${data[i + 2]}`;
				cell.type = ColorCellTypeMapping[colorStr];

				row.push(cell);
			}

			cells.push(row);
		}

		return new Map(size, cells);
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
