export default interface IEntityDeathAnimationEngine {
	onAnimationComplete: () => void;

	init(mesh: THREE.Mesh, size: number): void;
	startAnimation(): void;
	runAnimation(): void;
	cancelAnimation(): void;
}
