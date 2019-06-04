import * as THREE from "three";

import Cell from "./Cell";

export default class Map {
	readonly size: number;
	readonly cells: Cell[][];

	constructor(size: number, cells: Cell[][]) {
		this.size = size;
		this.cells = cells;
	}

	convertToMapPosition(position: THREE.Vector3, round = true): THREE.Vector3 {
		const mapPosition = position.clone();
		const method = round ? "round" : "floor";

		mapPosition.x = THREE.Math.clamp(Math[method](mapPosition.x), 0, this.size - 1);
		mapPosition.z = THREE.Math.clamp(Math[method](mapPosition.z), 0, this.size - 1);

		return mapPosition;
	}

	getCell(x: number, y: number): Cell | null {
		if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
			return this.cells[y][x];
		}

		return null;
	}
}
