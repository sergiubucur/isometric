import AssetType from "./AssetType";

export type Asset = {
	name?: string,
	type?: AssetType,
	filename?: string,
	content?: object;
};

export type AssetManifest = {
	[key: string]: Asset
};

const manifest: AssetManifest = {
	test: { name: "test", type: AssetType.Map, filename: "test.png" }
};

export default manifest;
