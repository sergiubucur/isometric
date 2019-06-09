import { MapLoaderResult } from "./MapLoader";

export default interface IMapLoader {
	loadMap(source: HTMLImageElement): MapLoaderResult;
}
