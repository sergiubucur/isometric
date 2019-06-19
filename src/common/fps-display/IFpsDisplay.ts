export default interface IFpsDisplay {
	afterFrame(): void;
	show(): void;
	hide(): void;
}
