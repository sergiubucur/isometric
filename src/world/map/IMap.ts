import Cell from "./Cell";
import MapMatrixType from "./MapMatrixType";

export default interface IMap {
	readonly size: number;
	readonly cells: Cell[][];

	convertToMapPosition(position: THREE.Vector3): THREE.Vector3;
	getCell(x: number, y: number): Cell | null;
	isCellPassable(x: number, y: number, ignoreIds?: number[]): boolean;
	areaIsPassable(x: number, y: number, radius: number): boolean;
	occupyCell(x: number, y: number, id: number, matrixType?: MapMatrixType): void;
	vacateCell(x: number, y: number, matrixType?: MapMatrixType): void;
	getAllEntityIdsInArea(x: number, y: number, radius: number, matrixType?: MapMatrixType): number[];
	getEntityIdAt(x: number, y: number, matrixType?: MapMatrixType): number | null;
}
