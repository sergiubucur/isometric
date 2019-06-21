import * as THREE from "three";

import IMap from "./map/IMap";
import ProjectileData from "../entity/projectile/ProjectileData";
import IMonster from "../entity/monster/IMonster";
import IDoor from "../entity/door/IDoor";
import IPowerup from "../entity/powerup/IPowerup";
import PowerupType from "../entity/powerup/PowerupType";

export default interface IWorld {
	readonly map: IMap;
	readonly totalMonsters: number;

	dispose(): void;
	addMesh(mesh: THREE.Object3D): void;
	removeMesh(mesh: THREE.Object3D): void;
	addProjectile(data: ProjectileData): void;
	areaDamage(position: THREE.Vector3, radius: number, originId: number): void;
	getEntityAtPosition(position: THREE.Vector3, convertToMapPosition?: boolean): IMonster | IDoor;
	getPowerupsInArea(position: THREE.Vector3, radius: number): IPowerup[];
	addPowerup(position: THREE.Vector3, type: PowerupType): void;
}
