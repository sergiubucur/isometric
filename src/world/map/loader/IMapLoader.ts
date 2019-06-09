import Map from "../Map";

export default interface IMapLoader {
	loadMap(source: HTMLImageElement): Map;
}
