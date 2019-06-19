import * as THREE from "three";

import IMap from "./map/IMap";
import ProjectileData from "../entity/projectile/ProjectileData";
import IMonster from "../entity/monster/IMonster";
import IDoor from "../entity/door/IDoor";

export default interface IWorld {
	readonly map: IMap;
	readonly totalMonsters: number;

	dispose(): void;
	addMesh(mesh: THREE.Object3D): void;
	removeMesh(mesh: THREE.Object3D): void;
	addProjectile(data: ProjectileData): void;
	areaDamage(position: THREE.Vector3, radius: number, originId: number): void;
	getEntityAtPosition(position: THREE.Vector3, convertToMapPosition?: boolean): IMonster | IDoor | null;
}
