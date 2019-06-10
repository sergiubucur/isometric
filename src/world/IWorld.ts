import * as THREE from "three";

import IMap from "./map/IMap";
import ProjectileData from "../entity/projectile/ProjectileData";

export default interface IWorld {
	readonly map: IMap;

	addMesh(mesh: THREE.Mesh): void;
	removeMesh(mesh: THREE.Mesh): void;
	addProjectile(data: ProjectileData): void;
	areaDamage(position: THREE.Vector3, radius: number, originId: number): void;
}
