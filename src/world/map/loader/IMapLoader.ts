import { Result } from "./MapLoader";

export default interface IMapLoader {
	loadMap(source: HTMLImageElement): Result;
}
