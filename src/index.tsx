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
import MouseControls from "./entity/player/mouse-controls/MouseControls";
import Player from "./entity/player/Player";
import Core from "./Core";
import Monster from "./entity/monster/Monster";
import EntityId from "./entity/entity-id/EntityId";
import EntityMovementEngine from "./entity/movement/EntityMovementEngine";
import UIRoot from "./ui/UIRoot";

const container = new Container();

container.registerSingleton("ILogger", Logger);
container.registerSingleton("IAssetService", AssetService);
container.registerSingleton("IInputTracker", InputTracker);
container.registerSingleton("Core", Core,
	"ILogger", "IAssetService", "IInputTracker", Factory("ICamera"), Factory("IRenderer"), Factory("IWorld"), Factory("IPlayer"),
	Factory("IUIRoot"));
container.registerSingleton("ICamera", Camera);
container.registerSingleton("IRenderer", Renderer);
container.register("IWorldMeshBuilder", WorldMeshBuilder);
container.register("IMapLoader", MapLoader);
container.registerSingleton("IWorld", World, "IAssetService", "IMapLoader", "IWorldMeshBuilder", Factory("IMonster"));
container.register("IMouseControls", MouseControls, "ICamera", "IInputTracker", "IWorld", "ILogger");
container.registerSingleton("IPlayer", Player,
	"IMouseControls", "ICamera", "IInputTracker", "IWorld", "ILogger", "IEntityId", "IEntityMovementEngine");
container.register("IMonster", Monster, "IWorld", "IPlayer", "IEntityId", "IEntityMovementEngine");
container.registerSingleton("IEntityId", EntityId);
container.register("IEntityMovementEngine", EntityMovementEngine, "IWorld");
container.registerSingleton("IUIRoot", UIRoot, "IWorld", "IPlayer", "ILogger");

container.resolve("Core");
