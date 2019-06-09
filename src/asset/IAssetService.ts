import { AssetManifest } from "./AssetManifest";

export default interface IAssetService {
	readonly assets: AssetManifest;

	loadAssets(): Promise<void>;
}
