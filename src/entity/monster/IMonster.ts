import * as THREE from "three";

import IComponent from "../../common/IComponent";

export default interface IMonster extends IComponent {
	init(position: THREE.Vector3): void;
}
