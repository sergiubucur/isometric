import "./index.scss";
import Container, { Factory } from "./common/ioc-container/Container";
import Logger from "./common/logger/Logger";
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
import Monster from "./monster/Monster";
import EntityId from "./common/entity-id/EntityId";

const container = new Container();

container.registerSingleton("ILogger", Logger);
container.registerSingleton("IAssetService", AssetService);
container.registerSingleton("IInputTracker", InputTracker);
container.registerSingleton("ICore", Core, "ILogger", "IAssetService", "IInputTracker",
	Factory("ICamera"), Factory("IRenderer"), Factory("IWorld"), Factory("IPlayer"), Factory("IMonster"));
container.registerSingleton("ICamera", Camera);
container.registerSingleton("IRenderer", Renderer);
container.register("IWorldMeshBuilder", WorldMeshBuilder);
container.register("IMapLoader", MapLoader);
container.registerSingleton("IWorld", World, "IMapLoader", "IWorldMeshBuilder");
container.register("IMouseControls", MouseControls, "ICamera", "IInputTracker", "IWorld", "ILogger");
container.registerSingleton("IPlayer", Player, "IMouseControls", "ICamera", "IInputTracker", "IWorld", "ILogger", "IEntityId");
container.register("IMonster", Monster, "IWorld", "IPlayer", "IEntityId");
container.registerSingleton("IEntityId", EntityId);

container.resolve("ICore");
