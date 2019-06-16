import * as THREE from "three";

import IComponent from "../../../common/IComponent";

export default interface IMouseControls extends IComponent {
	mousePosition: THREE.Vector3;

	onLeftClick: () => void;
	onRightClick: () => void;
	show(): void;
	hide(): void;
}
