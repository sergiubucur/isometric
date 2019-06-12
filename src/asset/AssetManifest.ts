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
	testMap: { name: "testMap", type: AssetType.Map, filename: "test.png" },
	human: { name: "human", type: AssetType.Mesh, filename: "human_low.glb" }
};

export default manifest;
