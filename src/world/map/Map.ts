import * as THREE from "three";

import Cell from "./Cell";

export default class Map {
	readonly size: number;
	readonly cells: Cell[][];

	constructor(size: number, cells: Cell[][]) {
		this.size = size;
		this.cells = cells;
	}

	convertToMapPosition(position: THREE.Vector3): THREE.Vector3 {
		const mapPosition = position.clone();

		mapPosition.x = Math.round(mapPosition.x);
		mapPosition.z = Math.round(mapPosition.z);

		return mapPosition;
	}

	getCell(x: number, y: number): Cell | null {
		if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
			return this.cells[y][x];
		}

		return null;
	}
}
