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
import EntityMovementEngine from "./entity/engine/movement/EntityMovementEngine";
import UIRoot from "./ui/UIRoot";
import Projectile from "./entity/projectile/Projectile";
import PointLightCache from "./world/point-light-cache/PointLightCache";
import EntityMeleeAttackEngine from "./entity/engine/melee-attack/EntityMeleeAttackEngine";
import ICore from "./ICore";
import PrimitiveCache from "./world/primitive-cache/PrimitiveCache";
import EntityDeathAnimationEngine from "./entity/engine/death-animation/EntityDeathAnimationEngine";
import EntityRangedAttackEngine from "./entity/engine/ranged-attack/EntityRangedAttackEngine";
import Door from "./entity/door/Door";

const container = new Container();

container.registerSingleton(Types.ILogger, Logger);

container.registerSingleton(Types.IAssetService, AssetService);

container.registerSingleton(Types.IInputTracker, InputTracker);

container.registerSingleton(Types.ICore, Core,
	Types.ILogger, Factory(Types.IAssetService), Types.IInputTracker, Factory(Types.ICamera), Factory(Types.IRenderer), Factory(Types.IWorld),
	Factory(Types.IPlayer), Factory(Types.IUIRoot));

container.registerSingleton(Types.ICamera, Camera);

container.registerSingleton(Types.IRenderer, Renderer);

container.register(Types.IWorldMeshBuilder, WorldMeshBuilder, Types.IAssetService);

container.register(Types.IMapLoader, MapLoader);

container.registerSingleton(Types.IWorld, World, Types.IAssetService, Types.IMapLoader, Types.IWorldMeshBuilder, Factory(Types.IMonster),
	Factory(Types.IProjectile), Types.ILogger, Factory(Types.IPointLightCache), Types.IPrimitiveCache, Factory(Types.IDoor));

container.register(Types.IMouseControls, MouseControls, Types.ICamera, Types.IInputTracker, Types.IWorld, Types.ILogger);

container.registerSingleton(Types.IPlayer, Player,
	Types.IMouseControls, Types.ICamera, Types.IInputTracker, Types.IWorld, Types.ILogger, Types.IEntityId, Types.IEntityMovementEngine,
	Types.IAssetService, Types.IEntityDeathAnimationEngine);

container.register(Types.IMonster, Monster, Types.IWorld, Types.IPlayer, Types.IEntityId, Types.IEntityMovementEngine, Types.IAssetService,
	Factory(Types.IEntityMeleeAttackEngine), Factory(Types.IEntityRangedAttackEngine), Types.IPrimitiveCache, Types.IEntityDeathAnimationEngine);

container.registerSingleton(Types.IEntityId, EntityId);

container.register(Types.IEntityMovementEngine, EntityMovementEngine, Types.IWorld);

container.registerSingleton(Types.IUIRoot, UIRoot, Types.IWorld, Types.IPlayer, Types.ILogger);

container.register(Types.IProjectile, Projectile, Types.IWorld, Types.IEntityId, Types.IEntityMovementEngine, Types.IPointLightCache,
	Types.IPrimitiveCache);

container.registerSingleton(Types.IPointLightCache, PointLightCache, Types.IWorld);

container.register(Types.IEntityMeleeAttackEngine, EntityMeleeAttackEngine);

container.registerSingleton(Types.IPrimitiveCache, PrimitiveCache);

container.register(Types.IEntityDeathAnimationEngine, EntityDeathAnimationEngine);

container.register(Types.IEntityRangedAttackEngine, EntityRangedAttackEngine);

container.register(Types.IDoor, Door, Types.IWorld, Types.IEntityId);

const core = container.resolve(Types.ICore) as ICore;
core.onRestart = () => {
	container.disposeSingleton(Types.ICamera);
	container.disposeSingleton(Types.IRenderer);
	container.disposeSingleton(Types.IWorld);
	container.disposeSingleton(Types.IPlayer);
	container.disposeSingleton(Types.IEntityId);
	container.disposeSingleton(Types.IUIRoot);
	container.disposeSingleton(Types.IPointLightCache);
	container.disposeSingleton(Types.IPrimitiveCache);
	container.disposeSingleton(Types.IAssetService);
};
