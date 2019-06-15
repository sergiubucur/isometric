import { AssetDictionary } from "./AssetManifest";

export default interface IAssetService {
	readonly assets: AssetDictionary;

	dispose(): void;
	loadAssets(): Promise<void>;
}
