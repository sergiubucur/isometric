import Core from "./core/Core";
import AssetService from "./asset/AssetService";
import "./index.scss";

const assetService = new AssetService();

const core = new Core(assetService);
core.start();
