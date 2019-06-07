import * as THREE from "three";

import IComponent from "../../common/IComponent";

export default interface IMouseControls extends IComponent {
	onLeftClick: (mousePosition: THREE.Vector3) => void;
	onRightClick: (mousePosition: THREE.Vector3) => void;
}
