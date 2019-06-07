import Container, { Factory } from "./ioc-container/Container";
import Logger from "./logger/Logger";
import AssetService from "./asset/AssetService";
import InputTracker from "./input-tracker/InputTracker";
import Camera from "./camera/Camera";
import Renderer from "./renderer/Renderer";
import WorldMeshBuilder from "./world/mesh-builder/WorldMeshBuilder";
import MapLoader from "./world/map/loader/MapLoader";
import World from "./world/World";
import MouseControls from "./player/mouse-controls/MouseControls";
import Player from "./player/Player";
import Core from "./Core";
import "./index.scss";

const container = new Container();

container.registerSingleton("ILogger", Logger);
container.registerSingleton("IAssetService", AssetService);
container.registerSingleton("IInputTracker", InputTracker);
container.registerSingleton("Core", Core, "ILogger", "IAssetService", "IInputTracker",
	Factory("ICamera"), Factory("IRenderer"), Factory("IWorld"), Factory("IPlayer"));
container.registerSingleton("ICamera", Camera);
container.registerSingleton("IRenderer", Renderer);
container.register("IWorldMeshBuilder", WorldMeshBuilder);
container.register("IMapLoader", MapLoader);
container.registerSingleton("IWorld", World, "IMapLoader", "IWorldMeshBuilder");
container.register("IMouseControls", MouseControls, "ICamera", "IInputTracker", "IWorld", "ILogger");
container.register("IPlayer", Player, "IMouseControls", "ICamera", "IInputTracker", "IWorld", "ILogger");

container.resolve("Core");
