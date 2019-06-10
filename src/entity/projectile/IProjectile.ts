import IComponent from "../../common/IComponent";
import ProjectileData from "./ProjectileData";

export default interface IProjectile extends IComponent {
	readonly id: number;
	readonly toBeDeleted: boolean;

	init(data: ProjectileData): void;
	dispose(): void;
}
