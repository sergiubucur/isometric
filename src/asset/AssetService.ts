import IAssetService from "./IAssetService";

export default class AssetService implements IAssetService {
	loadAssets() : Promise<object> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({});
			}, 1000);
		});
	}
}
