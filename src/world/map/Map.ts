import * as THREE from "three";

import Cell from "./Cell";
import CellType from "./CellType";

// TODO: add interface
export default class Map {
	readonly size: number;
	readonly cells: Cell[][];

	private _occupiedCells: number[][];

	constructor(size: number, cells: Cell[][]) {
		this.size = size;
		this.cells = cells;

		this._occupiedCells = [];

		for (let i = 0; i < size; i++) {
			const row = [];

			for (let j = 0; j < size; j++) {
				row.push(0);
			}

			this._occupiedCells.push(row);
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

	isCellPassable(x: number, y: number, id: number) {
		const cell = this.getCell(x, y);

		if (!cell) {
			return false;
		}

		const occupiedCell = this._occupiedCells[y][x];
		const isOccupied = occupiedCell !== 0 && occupiedCell !== id;

		return !isOccupied && cell.type === CellType.EmptyFloor;
	}

	occupyCell(x: number, y: number, id: number) {
		this._occupiedCells[y][x] = id;
	}

	vacateCell(x: number, y: number) {
		this._occupiedCells[y][x] = 0;
	}
}
