import IInputTracker from "./IInputTracker";

const ButtonMapping: { [key: number]: string } = {
	0: "left",
	1: "middle",
	2: "right"
};

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
			const that: any = this;

			that[ButtonMapping[e.button] + "MouseDown"] = true;
		});

		document.addEventListener("mouseup", (e) => {
			const that: any = this;

			that[ButtonMapping[e.button] + "MouseDown"] = false;
		});

		document.addEventListener("wheel", (e) => {
			if (e.deltaY === 0) {
				return;
			}
			
			this.wheelEvents.push(e.deltaY / Math.abs(e.deltaY));
		});
	}

	update() {
		this.wheelEvents.length = 0;
	}
}
