import Logger from "./logger/Logger";
import AssetService from "./asset/AssetService";
import Core from "./core/Core";
import "./index.scss";

const logger = new Logger();
const assetService = new AssetService();

const core = new Core(logger, assetService);
core.start();
