import MapMatrixType from "./MapMatrixType";
import CellType from "./CellType";

export default interface IMap {
	readonly size: number;

	convertToMapPosition(position: THREE.Vector3): THREE.Vector3;
	getCell(x: number, y: number): CellType;
	isCellPassable(x: number, y: number, ignoreIds?: number[]): boolean;
	areaIsPassable(x: number, y: number, radius: number): boolean;
	occupyCell(x: number, y: number, id: number, matrixType?: MapMatrixType): void;
	vacateCell(x: number, y: number, matrixType?: MapMatrixType): void;
	getAllEntityIdsInArea(x: number, y: number, radius: number, matrixType?: MapMatrixType): number[];
	getEntityIdAt(x: number, y: number, matrixType?: MapMatrixType): number;
}
