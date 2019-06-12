import CellType from "../CellType";
import IMap from "../IMap";

export type Rectangle = {
	x0: number,
	y0: number,
	x1: number,
	y1: number,
	type: CellType
};

export type Edge = Rectangle;

export type MapLoaderResult = {
	map: IMap;
	rectangles: Rectangle[];
	edges: Edge[];
};

export default interface IMapLoader {
	loadMap(source: HTMLImageElement): MapLoaderResult;
}
