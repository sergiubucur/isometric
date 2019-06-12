import AssetType from "./AssetType";

export type Asset = {
	name?: string,
	type?: AssetType,
	filename?: string,
	content?: object;
};

export type AssetDictionary = {
	[key: string]: Asset
};

const manifest: Asset[] = [
	{ name: "testMap", type: AssetType.Map, filename: "test.png" },
	{ name: "human", type: AssetType.Mesh, filename: "human_low.glb" },
	{ name: "metal", type: AssetType.Texture, filename: "metal.jpg" },
	{ name: "normalMetal", type: AssetType.Texture, filename: "normal_metal.jpg" }
];

export default manifest;
