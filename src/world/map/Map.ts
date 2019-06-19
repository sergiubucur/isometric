import * as THREE from "three";

import Cell from "./Cell";
import CellType from "./CellType";
import IMap from "./IMap";
import MapMatrixType from "./MapMatrixType";

export default class Map implements IMap {
	size: number;
	cells: Cell[][];
	matrices: { [key: number]: number[][] };

	constructor(size: number, cells: Cell[][]) {
		this.size = size;
		this.cells = cells;

		this.matrices = {
			[MapMatrixType.Physical]: this.getCellMatrix(),
			[MapMatrixType.Powerup]: this.getCellMatrix()
		};
	}

	private getCellMatrix() {
		const matrix = [];

		for (let i = 0; i < this.size; i++) {
			const row = [];

			for (let j = 0; j < this.size; j++) {
				row.push(0);
			}

			matrix.push(row);
		}

		return matrix;
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

	isCellPassable(x: number, y: number, ignoreIds: number[] = []) {
		const cell = this.getCell(x, y);

		if (!cell) {
			return false;
		}

		const matrix = this.getMatrix(MapMatrixType.Physical);
		const id = matrix[y][x];
		const isOccupied = id !== 0 && ignoreIds.indexOf(id) === -1;

		return !isOccupied && (cell.type === CellType.EmptyFloor || cell.type === CellType.Moving);
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

	getAllEntityIdsInArea(x: number, y: number, radius: number, matrixType = MapMatrixType.Physical): number[] {
		const entityIds = [];
		const matrix = this.getMatrix(matrixType);

		for (let i = y - radius; i < y + radius; i++) {
			for (let j = x - radius; j < x + radius; j++) {
				const cell = this.getCell(j, i);

				if (!cell) {
					continue;
				}

				const id = matrix[i][j];
				if (id > 0 && entityIds.indexOf(id) === -1) {
					entityIds.push(id);
				}
			}
		}

		return entityIds;
	}

	getEntityIdAt(x: number, y: number, matrixType = MapMatrixType.Physical): number | null {
		const cell = this.getCell(x, y);

		if (!cell) {
			return null;
		}

		const matrix = this.getMatrix(matrixType);
		return matrix[y][x];
	}

	occupyCell(x: number, y: number, id: number, matrixType = MapMatrixType.Physical) {
		const matrix = this.getMatrix(matrixType);
		matrix[y][x] = id;
	}

	vacateCell(x: number, y: number, matrixType = MapMatrixType.Physical) {
		const matrix = this.getMatrix(matrixType);
		matrix[y][x] = 0;
	}

	private getMatrix(type: MapMatrixType) {
		return this.matrices[type];
	}
}
