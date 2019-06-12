import "./index.scss";
import Container, { Factory } from "./common/ioc-container/Container";
import Types from "./common/ioc-container/Types";
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
import Projectile from "./entity/projectile/Projectile";
import PointLightCache from "./world/point-light-cache/PointLightCache";

const container = new Container();

container.registerSingleton(Types.ILogger, Logger);

container.registerSingleton(Types.IAssetService, AssetService);

container.registerSingleton(Types.IInputTracker, InputTracker);

container.registerSingleton(Types.ICore, Core,
	Types.ILogger, Types.IAssetService, Types.IInputTracker, Factory(Types.ICamera), Factory(Types.IRenderer), Factory(Types.IWorld),
	Factory(Types.IPlayer), Factory(Types.IUIRoot));

container.registerSingleton(Types.ICamera, Camera);

container.registerSingleton(Types.IRenderer, Renderer);

container.register(Types.IWorldMeshBuilder, WorldMeshBuilder);

container.register(Types.IMapLoader, MapLoader);

container.registerSingleton(Types.IWorld, World, Types.IAssetService, Types.IMapLoader, Types.IWorldMeshBuilder, Factory(Types.IMonster),
	Factory(Types.IProjectile), Types.ILogger);

container.register(Types.IMouseControls, MouseControls, Types.ICamera, Types.IInputTracker, Types.IWorld, Types.ILogger);

container.registerSingleton(Types.IPlayer, Player,
	Types.IMouseControls, Types.ICamera, Types.IInputTracker, Types.IWorld, Types.ILogger, Types.IEntityId, Types.IEntityMovementEngine);

container.register(Types.IMonster, Monster, Types.IWorld, Types.IPlayer, Types.IEntityId, Types.IEntityMovementEngine);

container.registerSingleton(Types.IEntityId, EntityId);

container.register(Types.IEntityMovementEngine, EntityMovementEngine, Types.IWorld);

container.registerSingleton(Types.IUIRoot, UIRoot, Types.IWorld, Types.IPlayer, Types.ILogger);

container.register(Types.IProjectile, Projectile, Types.IWorld, Types.IEntityId, Types.IEntityMovementEngine);

container.registerSingleton(Types.IPointLightCache, PointLightCache, Types.IWorld);

container.resolve(Types.ICore);
