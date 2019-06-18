import IEntityMovementEngine from "../../engine/movement/IEntityMovementEngine";

export default interface IPlayerUseEngine {
	init(movementEngine: IEntityMovementEngine): void;
	afterPositionUpdate(): void;
	afterMouseOverTargetUpdate(mouseOverTarget: object): void;
	onLeftClick(mouseOverTarget: object): void;
}
