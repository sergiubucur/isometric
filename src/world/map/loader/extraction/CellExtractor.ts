import Cell from "../../Cell";
import CellType from "../../CellType";

const ColorCellTypeMapping: { [key: string]: CellType } = {
	"0,0,0": CellType.Void,
	"64,64,64": CellType.Concrete,
	"255,255,255": CellType.EmptyFloor,
	"0,128,255": CellType.Moving
};

export default class CellExtractor {
	extract(source: HTMLImageElement) {
		const data = this.getImageData(source);

		const size = source.width;
		const cells: Cell[][] = [];

		for (let y = 0; y < size; y++) {
			const row: Cell[] = [];

			for (let x = 0; x < size; x++) {
				const cell: Cell = { type: null };

				const i = (y * size + x) * 4;
				const colorStr = `${data[i]},${data[i + 1]},${data[i + 2]}`;

				if (!ColorCellTypeMapping[colorStr]) {
					throw new Error("undefined cell type");
				}

				cell.type = ColorCellTypeMapping[colorStr];

				row.push(cell);
			}

			cells.push(row);
		}

		return cells;
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
