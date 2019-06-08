import IComponent from "../../common/IComponent";

export default interface IPlayer extends IComponent {
	readonly position: THREE.Vector3;
}
