export default interface IInputTracker {
	readonly keysPressed: { [key: number]: boolean };
	readonly ctrlKey: boolean;
	readonly altKey: boolean;
	readonly shiftKey: boolean;
	readonly mouseX: number;
	readonly mouseY: number;
	readonly leftMouseDown: boolean;
	readonly middleMouseDown: boolean;
	readonly rightMouseDown: boolean;
	readonly wheelEvents: number[];

	update(): void;
}
