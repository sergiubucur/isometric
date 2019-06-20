import IGameLoop from "./IGameLoop";

export default class GameLoop implements IGameLoop {
	onUpdate: () => void;
	onDraw: () => void;
	afterFrame: () => void;

	constructor() {
		this.onUpdate = () => {};
		this.onDraw = () => {};
		this.afterFrame = () => {};
	}

	run() {
		requestAnimationFrame(() => this.run());

		this.onUpdate();
		this.onDraw();

		this.afterFrame();
	}
}
