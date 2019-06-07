import Map from "./Map";

export default interface IMapLoader {
	loadMap(source: string): Map;
}
