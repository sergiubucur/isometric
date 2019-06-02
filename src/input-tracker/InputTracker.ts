import IInputTracker from "./IInputTracker";

export default class InputTracker implements IInputTracker {
	keysPressed: { [key: number]: boolean };
	ctrlKey: boolean;
	altKey: boolean;
	shiftKey: boolean;
	mouseX: number;
	mouseY: number;
	leftMouseDown: boolean;
	middleMouseDown: boolean;
	rightMouseDown: boolean;
	wheelEvents: number[];

	constructor() {
		this.keysPressed = {};
		this.ctrlKey = false;
		this.altKey = false;
		this.shiftKey = false;
		this.mouseX = 0;
		this.mouseY = 0;
		this.leftMouseDown = false;
		this.middleMouseDown = false;
		this.rightMouseDown = false;
		this.wheelEvents = [];

		this.init();
	}

	private init() {
		document.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		document.addEventListener("keydown", (e) => {
			this.keysPressed[e.keyCode] = true;

			this.ctrlKey = e.ctrlKey;
			this.altKey = e.altKey;
			this.shiftKey = e.shiftKey;
		});

		document.addEventListener("keyup", (e) => {
			this.keysPressed[e.keyCode] = false;

			this.ctrlKey = e.ctrlKey;
			this.altKey = e.altKey;
			this.shiftKey = e.shiftKey;
		});

		document.addEventListener("mousemove", (e) => {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
		});

		document.addEventListener("mousedown", (e) => {
			switch (e.button) {
				case 0:
					this.leftMouseDown = true;
					break;

				case 1:
					this.middleMouseDown = true;
					break;

				case 2:
					this.rightMouseDown = true;
					break;
			}
		});

		document.addEventListener("mouseup", (e) => {
			switch (e.button) {
				case 0:
					this.leftMouseDown = false;
					break;

				case 1:
					this.middleMouseDown = false;
					break;

				case 2:
					this.rightMouseDown = false;
					break;
			}
		});

		document.addEventListener("wheel", (e) => {
			this.wheelEvents.push(e.deltaY / Math.abs(e.deltaY));
		});
	}

	update() {
		this.wheelEvents.length = 0;
	}
}
