import IComponent from "../../common/IComponent";

export default interface IPlayer extends IComponent {
	readonly id: number;
	readonly position: THREE.Vector3;
}
