import { AssetDictionary } from "./AssetManifest";

export default interface IAssetService {
	readonly assets: AssetDictionary;

	loadAssets(): Promise<void>;
}
