export default interface IFpsDisplay {
	beginFrame(): void;
	endFrame(): void;
	show(): void;
	hide(): void;
}
