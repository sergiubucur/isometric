import Cell from "./Cell";

export default interface IMap {
	readonly size: number;
	readonly cells: Cell[][];

	convertToMapPosition(position: THREE.Vector3): THREE.Vector3;
	getCell(x: number, y: number): Cell | null;
	isCellPassable(x: number, y: number, id: number): boolean;
	occupyCell(x: number, y: number, id: number): void;
	vacateCell(x: number, y: number): void;
}
