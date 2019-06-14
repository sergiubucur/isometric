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

	areaIsPassable(x: number, y: number, radius: number) {
		for (let i = y - radius; i < y + radius; i++) {
			for (let j = x - radius; j < x + radius; j++) {
				if (!this.isCellPassable(j, i)) {
					return false;
				}
			}
		}

		return true;
	}

	getAllEntityIdsInArea(x: number, y: number, radius: number): number[] {
		const entityIds = [];

		for (let i = y - radius; i < y + radius; i++) {
			for (let j = x - radius; j < x + radius; j++) {
				const cell = this.getCell(j, i);

				if (!cell) {
					continue;
				}

				const id = this.occupiedCells[i][j];
				if (id > 0 && entityIds.indexOf(id) === -1) {
					entityIds.push(id);
				}
			}
		}

		return entityIds;
	}

	isCellPassable(x: number, y: number, ignoreIds: number[] = []) {
		const cell = this.getCell(x, y);

		if (!cell) {
			return false;
		}

		const id = this.occupiedCells[y][x];
		const isOccupied = id !== 0 && ignoreIds.indexOf(id) === -1;

		return !isOccupied && cell.type === CellType.EmptyFloor;
	}

	getEntityIdAt(x: number, y: number): number | null {
		const cell = this.getCell(x, y);

		if (!cell) {
			return null;
		}

		return this.occupiedCells[y][x];
	}

	occupyCell(x: number, y: number, id: number) {
		this.occupiedCells[y][x] = id;
	}

	vacateCell(x: number, y: number) {
		this.occupiedCells[y][x] = 0;
	}
}
