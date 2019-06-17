import IComponent from "../../common/IComponent";
import IMonster from "../monster/IMonster";

export default interface IPlayer extends IComponent {
	readonly id: number;
	readonly position: THREE.Vector3;
	readonly invisible: boolean;
	readonly size: number;
	readonly health: number;
	readonly totalHealth: number;
	readonly mana: number;
	readonly totalMana: number;
	readonly dead: boolean;
	readonly mouseOverTarget: IMonster | null;

	damage(): void;
	setInvisibility(value: boolean): void;
	spendMana(value: number): void;
	updateMeshPosition(): void;
}
