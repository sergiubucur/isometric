import IComponent from "../../common/IComponent";
import IMonster from "../monster/IMonster";
import IPlayerSpellEngine from "./spell-engine/IPlayerSpellEngine";
import IDoor from "../door/IDoor";
import AuraType from "./aura-engine/AuraType";
import IPlayerAuraEngine from "./aura-engine/IPlayerAuraEngine";

export default interface IPlayer extends IComponent {
	readonly id: number;
	readonly position: THREE.Vector3;
	readonly size: number;
	readonly health: number;
	readonly totalHealth: number;
	readonly mana: number;
	readonly totalMana: number;
	readonly dead: boolean;
	readonly mouseOverTarget: IMonster | IDoor;
	readonly spellEngine: IPlayerSpellEngine;
	readonly experience: number;
	readonly experienceToNextLevel: number;
	readonly auraEngine: IPlayerAuraEngine;

	damage(): void;
	setInvisibility(value: boolean): void;
	spendMana(value: number): void;
	updateMeshPosition(): void;
	gainExperience(): void;
	gainHealth(value: number): void;
	gainMana(value: number): void;
}
