import * as THREE from "three";

type ProjectileData = {
	startPosition: THREE.Vector3;
	targetPosition: THREE.Vector3;
	speed: number;
	color: THREE.Color;
	originEntityId: number;
	splashRadius: number;
};

export default ProjectileData;
