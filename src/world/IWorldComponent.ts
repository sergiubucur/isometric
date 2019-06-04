import * as THREE from "three";

import IComponent from "../common/IComponent";

export default interface IWorldComponent extends IComponent {
	readonly scene: THREE.Scene;

	init(): Promise<void>;
}
