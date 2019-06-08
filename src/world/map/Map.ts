import * as THREE from "three";

import Cell from "./Cell";
import CellType from "./CellType";
import IMap from "./IMap";

export default class Map implements IMap {
	size: number;
	cells: Cell[][];
	occupiedCells: number[][];

	constructor(size: number, cells: Cell[][]) {
		this.size = size;
		this.cells = cells;

		this.initOccupiedCells();
	}

	private initOccupiedCells() {
		this.occupiedCells = [];

		for (let i = 0; i < this.size; i++) {
			const row = [];

			for (let j = 0; j < this.size; j++) {
				row.push(0);
			}

			this.occupiedCells.push(row);
		}
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

	isCellPassable(x: number, y: number, id = -1) {
		const cell = this.getCell(x, y);

		if (!cell) {
			return false;
		}

		const occupiedCell = this.occupiedCells[y][x];
		const isOccupied = occupiedCell !== 0 && occupiedCell !== id;

		return !isOccupied && cell.type === CellType.EmptyFloor;
	}

	occupyCell(x: number, y: number, id: number) {
		this.occupiedCells[y][x] = id;
	}

	vacateCell(x: number, y: number) {
		this.occupiedCells[y][x] = 0;
	}
}
