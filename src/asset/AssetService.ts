import IAssetService from "./IAssetService";
import manifest, { AssetManifest, Asset } from "./AssetManifest";
import AssetType from "./AssetType";

const Paths = {
	[AssetType.Map]: "assets/maps/"
};

export default class AssetService implements IAssetService {
	assets: AssetManifest;

	private _resolve: any;
	private _totalAssets: number;
	private _loadedAssets: number;

	loadAssets() : Promise<void> {
		return new Promise((resolve) => {
			this._totalAssets = Object.keys(manifest).length;
			this._loadedAssets = 0;
			this.assets = {};
			this._resolve = resolve;

			Object.keys(manifest).forEach(key => {
				const asset = manifest[key];

				switch (asset.type) {
					case AssetType.Map:
						this.loadMap(asset);
						break;
				}
			});
		});
	}

	private loadMap(asset: Asset) {
		this.assets[asset.name] = {};
		Object.assign(this.assets[asset.name], asset);

		const img = new Image();
		img.src = Paths[asset.type] + asset.filename;
		img.onload = () => {
			this.assets[asset.name].content = img;
			this.onAssetLoaded();
		};
	}

	private onAssetLoaded() {
		this._loadedAssets++;

		if (this._loadedAssets === this._totalAssets) {
			this._resolve(this.assets);
		}
	}
}
