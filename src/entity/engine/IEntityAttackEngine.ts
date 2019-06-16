export default interface IEntityAttackEngine {
	onHit: () => void;

	update(): void;
	isAttacking(): boolean;
	performAttack(): void;
	canAttack(): boolean;
	startAttacking(): void;
}
