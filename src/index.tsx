import Logger from "./logger/Logger";
import AssetService from "./asset/AssetService";
import InputTracker from "./input-tracker/InputTracker";
import Core from "./Core";
import "./index.scss";

const logger = new Logger();
const assetService = new AssetService();
const inputTracker = new InputTracker();

new Core(logger, assetService, inputTracker);
