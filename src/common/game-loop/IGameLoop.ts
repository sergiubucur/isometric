export default interface IGameLoop {
	onUpdate: () => void;
	onDraw: () => void;
	afterFrame: () => void;

	run(): void;
}
