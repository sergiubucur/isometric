import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import IAssetService from "./IAssetService";
import manifest, { AssetManifest, Asset } from "./AssetManifest";
import AssetType from "./AssetType";

const Paths = {
	[AssetType.Map]: "assets/maps/",
	[AssetType.Mesh]: "assets/meshes/",
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

					case AssetType.Mesh:
						this.loadMesh(asset);
						break;

					default:
						throw new Error("no loader configured for this asset type");
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

	private loadMesh(asset: Asset) {
		this.assets[asset.name] = {};
		Object.assign(this.assets[asset.name], asset);

		const loader = new GLTFLoader();
		loader.load(Paths[asset.type] + asset.filename, (gltf) => {
			this.assets[asset.name].content = gltf.scene.children[0];
			this.onAssetLoaded();
		});
	}

	private onAssetLoaded() {
		this._loadedAssets++;

		if (this._loadedAssets === this._totalAssets) {
			this._resolve(this.assets);
		}
	}
}
