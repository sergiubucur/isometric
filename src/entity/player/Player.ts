import * as THREE from "three";

import IPlayer from "./IPlayer";
import IMouseControls from "./mouse-controls/IMouseControls";
import ICamera from "../../camera/ICamera";
import IInputTracker from "../../input-tracker/IInputTracker";
import IWorld from "../../world/IWorld";
import ILogger from "../../common/logger/ILogger";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../engine/movement/IEntityMovementEngine";
import Keybinds from "../../input-tracker/Keybinds";
import IAssetService from "../../asset/IAssetService";
import IMonster from "../monster/IMonster";
import IEntityDeathAnimationEngine from "../engine/death-animation/IEntityDeathAnimationEngine";
import IPlayerSpellEngine from "./spell-engine/IPlayerSpellEngine";
import IDoor from "../door/IDoor";
import IPlayerUseEngine from "./use-engine/IPlayerUseEngine";
import AuraType from "../aura/AuraType";
import IPlayerAuraEngine from "./aura-engine/IPlayerAuraEngine";

const StartPosition = new THREE.Vector3(16, 0, 16);
const Size = 2;
const Speed = 0.25;
const Color = 0xFFD8B2;
const PointLightIntensity = 3;
const PointLightDistance = 20;
const PointLightYOffset = 4;
const PointLightDeathColor = 0xff0000;
const MeshName = "human";
const TotalHealth = 100;
const TotalMana = 100;
const ManaRegen = 0.1;
const ExperienceToNextLevel = 10000;

export default class Player implements IPlayer {
	get position() {
		return this._movementEngine.position;
	}

	get spellEngine() {
		return this._spellEngine;
	}

	readonly id: number;
	invisible: boolean;
	readonly size: number;
	dead: boolean;
	health: number;
	totalHealth: number;
	mana: number;
	totalMana: number;
	manaRegen: number;
	mouseOverTarget: IMonster | IDoor | null;
	experience: number;
	experienceToNextLevel: number;
	readonly auraEngine: IPlayerAuraEngine;

	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;

	constructor(private _mouseControls: IMouseControls, private _camera: ICamera, private _inputTracker: IInputTracker,
		private _world: IWorld, private _logger: ILogger, private _entityId: IEntityId, private _movementEngine: IEntityMovementEngine,
		private _assetService: IAssetService, private _deathAnimationEngine: IEntityDeathAnimationEngine,
		private _spellEngine: IPlayerSpellEngine, private _useEngine: IPlayerUseEngine, auraEngine: IPlayerAuraEngine) {

		this._mouseControls.onLeftClick = () => this.handleLeftClick();

		this.id = this._entityId.getNewId();
		this.size = Size;
		this.dead = false;
		this.totalHealth = TotalHealth;
		this.health = this.totalHealth;
		this.totalMana = TotalMana;
		this.mana = this.totalMana;
		this.manaRegen = ManaRegen;
		this.mouseOverTarget = null;
		this.experience = 0;
		this.experienceToNextLevel = ExperienceToNextLevel;
		this.auraEngine = auraEngine;

		this.initMovementEngine();
		this._camera.setPosition(StartPosition);
		this.initMesh();
		this.initOtherEngines();
	}

	private initMovementEngine() {
		this._movementEngine.init(this.id, StartPosition, Size, Speed);
		this._movementEngine.afterPositionUpdate = () => {
			this._camera.setPosition(this._movementEngine.position);
			this.updateMeshPosition();
			this._useEngine.afterPositionUpdate();
			this.absorbPowerups();
		};
	}

	private initOtherEngines() {
		this._deathAnimationEngine.init(this._mesh, this.size);
		this._spellEngine.init(this, this._movementEngine, this._mouseControls);
		this._useEngine.init(this._movementEngine);
		this.auraEngine.init(this);
	}

	update() {
		if (this.dead) {
			this._deathAnimationEngine.runAnimation();

			if (this._inputTracker.keysPressed[Keybinds.Enter]) {
				this.resurrect();
			}
			return;
		}

		this.auraEngine.update();
		this.updateManaRegen();
		this._mouseControls.update();
		this.updateMouseOverTarget();
		this._movementEngine.move();
		this._spellEngine.update();
	}

	private updateMouseOverTarget() {
		this.mouseOverTarget = this._world.getEntityAtPosition(this._mouseControls.mousePosition, false);
		this._useEngine.afterMouseOverTargetUpdate(this.mouseOverTarget);
	}

	damage() {
		if (this.dead) {
			return;
		}

		this.setInvisibility(false);

		this.health -= 25;
		if (this.health <= 0) {
			this.health = 0;
			this.die();
		}
	}

	private updateManaRegen() {
		this.mana += this.manaRegen;
		this.mana = THREE.Math.clamp(this.mana, 0, this.totalMana);
	}

	private die() {
		this.experience = Math.floor(this.experience * 0.75);

		this.setInvisibility(false);
		this._pointLight.color.setHex(PointLightDeathColor);
		this.updateMeshPosition();
		this._deathAnimationEngine.startAnimation();
		this._movementEngine.clearCells();
		this._movementEngine.stop();
		this._mouseControls.hide();
		this.dead = true;
	}

	private resurrect() {
		this.auraEngine.clearAuras();
		this._pointLight.color.setHex(Color);
		this._deathAnimationEngine.cancelAnimation();
		this._mouseControls.show();
		this._movementEngine.moveTo(StartPosition);
		this.health = this.totalHealth;
		this.mana = this.totalMana;
		this.dead = false;
	}

	private handleLeftClick() {
		this._useEngine.onLeftClick(this.mouseOverTarget);
		this._movementEngine.startMovingTo(this._mouseControls.mousePosition);
	}

	setInvisibility(value: boolean) {
		if (value) {
			this.auraEngine.addAura(AuraType.Cloaked);
		} else {
			this.auraEngine.removeAura(AuraType.Cloaked);
		}

		(this._mesh.material as THREE.MeshPhongMaterial).opacity = value ? 0.33 : 1;
	}

	spendMana(value: number) {
		this.mana -= value;
	}

	private absorbPowerups() {
		const powerups = this._world.getPowerupsInArea(this._movementEngine.position, this.size);
		powerups.forEach(x => {
			this.auraEngine.addAura(AuraType.Energized);
			x.markForDeletion();
		});
	}

	private initMesh() {
		const geometry = (this._assetService.assets[MeshName].content as THREE.Mesh).geometry;
		const material = new THREE.MeshPhongMaterial({ color: Color });
		material.transparent = true;
		material.opacity = 1;

		this._mesh = new THREE.Mesh(geometry, material);
		this._mesh.scale.set(Size, Size, Size);
		this._mesh.rotation.order = "ZYX";

		this._pointLight = new THREE.PointLight(Color, PointLightIntensity, PointLightDistance);
		this._pointLight.position.set(0, PointLightYOffset, 0);

		this._mesh.add(this._pointLight);

		this.updateMeshPosition();

		this._world.addMesh(this._mesh);
	}

	updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
		this._mesh.rotation.y = this._movementEngine.rotationY;
	}

	gainExperience() {
		this.experience += Math.floor(ExperienceToNextLevel / this._world.totalMonsters);
		this.experience = THREE.Math.clamp(this.experience, 0, ExperienceToNextLevel);
	}

	gainHealth(value: number) {
		this.health += value;
		this.health = THREE.Math.clamp(this.health, 0, this.totalHealth);
	}

	gainMana(value: number) {
		this.mana += value;
		this.mana = THREE.Math.clamp(this.mana, 0, this.totalMana);
	}
}
