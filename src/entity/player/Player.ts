import * as THREE from "three";

import IPlayer from "./IPlayer";
import IMouseControls from "./mouse-controls/IMouseControls";
import ICamera from "../../camera/ICamera";
import IInputTracker from "../../input-tracker/IInputTracker";
import IWorld from "../../world/IWorld";
import ILogger from "../../common/logger/ILogger";
import IEntityId from "../entity-id/IEntityId";
import IEntityMovementEngine from "../movement-engine/IEntityMovementEngine";
import Keybinds from "../../input-tracker/Keybinds";
import IAssetService from "../../asset/IAssetService";
import IMonster from "../monster/IMonster";

const Size = 2;
const Speed = 0.25;
const SpellCooldown = 17;
const Color = 0xFFD8B2;
const ProjectileColor = 0xbada55;
const PointLightIntensity = 3;
const PointLightDistance = 20;
const PointLightYOffset = 4;
const MeshName = "human";

export default class Player implements IPlayer {
	get position() {
		return this._movementEngine.position;
	}

	id: number;
	invisible: boolean;
	readonly size: number;

	private _spellCooldown: number;
	private _mesh: THREE.Mesh;
	private _pointLight: THREE.PointLight;
	private _mouseOverTarget: IMonster | null;

	constructor(private _mouseControls: IMouseControls, private _camera: ICamera, private _inputTracker: IInputTracker,
		private _world: IWorld, private _logger: ILogger, private _entityId: IEntityId, private _movementEngine: IEntityMovementEngine,
		private _assetService: IAssetService) {

		this._mouseControls.onLeftClick = () => this.handleLeftClick();
		this._mouseControls.onRightClick = () => this.handleRightClick();

		this.id = this._entityId.getNewId();
		this.invisible = false;
		this.size = Size;
		this._spellCooldown = 0;
		this._mouseOverTarget = null;

		const startPosition = new THREE.Vector3(16, 0, 16);
		this._movementEngine.init(this.id, startPosition, Size, Speed);
		this._movementEngine.afterPositionUpdate = () => {
			this._camera.setPosition(this._movementEngine.position);
			this.updateMeshPosition();
		};

		this._camera.setPosition(startPosition);
		this.initMesh();
	}

	update() {
		this._mouseControls.update();
		this._mouseOverTarget = this._world.getMonsterAtPosition(this._mouseControls.mousePosition, false);
		this.move();

		if (this._inputTracker.keysPressed[Keybinds.D1]) {
			this.cloak();
		}

		if (this._inputTracker.keysPressed[Keybinds.D3]) {
			this.nova();
		}

		if (this._mouseOverTarget && !this._mouseOverTarget.dead && this._inputTracker.keysPressed[Keybinds.D2]) {
			this.touchOfDeath();
		}

		if (this._inputTracker.keysPressed[Keybinds.D4]) {
			this.teleport();
		}

		this._logger.logVector3("position", this._movementEngine.position);
		this._logger.log(`mouseOverTarget: ${this._mouseOverTarget ? `monster id ${this._mouseOverTarget.id}` : null}`);
		this._logger.logNumber("spell cooldown", this._spellCooldown);
	}

	private move() {
		this._movementEngine.move();

		if (this._spellCooldown > 0) {
			this._spellCooldown--;
		}
	}

	private handleLeftClick() {
		this._movementEngine.startMovingTo(this._mouseControls.mousePosition);
	}

	private handleRightClick() {
		if (this._spellCooldown === 0) {
			this._movementEngine.stop();
			this._spellCooldown = SpellCooldown;
			this.uncloak();

			this._movementEngine.velocity.copy(this._mouseControls.mousePosition).sub(this._movementEngine.position);
			this.updateMeshPosition();

			this._world.addProjectile({
				startPosition: this._movementEngine.position,
				targetPosition: this._mouseControls.mousePosition,
				speed: 0.5,
				color: new THREE.Color(ProjectileColor),
				originEntityId: this.id,
				splashRadius: 3
			});
		}
	}

	private cloak() {
		if (this._spellCooldown === 0) {
			this._movementEngine.stop();
			this._spellCooldown = SpellCooldown;

			this.setInvisibility(!this.invisible);
		}
	}

	private uncloak() {
		this.setInvisibility(false);
	}

	private setInvisibility(value: boolean) {
		this.invisible = value;
		(this._mesh.material as THREE.MeshPhongMaterial).opacity = this.invisible ? 0.5 : 1;
	}

	private nova() {
		if (this._spellCooldown === 0) {
			this._movementEngine.stop();
			this._spellCooldown = SpellCooldown;
			this.uncloak();

			for (let i = 0; i < 10; i++) {
				const targetPosition = new THREE.Vector3();
				targetPosition.x = Math.cos(Math.PI / 180 * i * 36);
				targetPosition.z = Math.sin(Math.PI / 180 * i * 36);
				targetPosition.add(this._movementEngine.position);

				this._world.addProjectile({
					startPosition: this._movementEngine.position,
					targetPosition,
					speed: 0.5,
					color: new THREE.Color(ProjectileColor),
					originEntityId: this.id,
					splashRadius: 3
				});
			}
		}
	}

	private touchOfDeath() {
		if (this._spellCooldown === 0) {
			this._movementEngine.stop();
			this._spellCooldown = SpellCooldown;
			this.uncloak();

			this._mouseOverTarget.damage();
		}
	}

	private teleport() {
		if (this._spellCooldown === 0) {
			this._movementEngine.stop();
			this._spellCooldown = SpellCooldown;
			this.uncloak();

			if (this._movementEngine.canMoveTo(this._mouseControls.mousePosition)) {
				this._movementEngine.velocity.copy(this._mouseControls.mousePosition).sub(this._movementEngine.position);
				this._movementEngine.moveTo(this._mouseControls.mousePosition);
			}
		}
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

	private updateMeshPosition() {
		this._mesh.position.copy(this._movementEngine.position);
		this._mesh.rotation.y = this._movementEngine.rotationY;
	}
}
