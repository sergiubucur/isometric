import React from "react";
import IPlayer from "../IPlayer";

export default interface IAura {
	readonly name: string;
	readonly iconName: string;
	readonly flipIcon: boolean;
	readonly tooltip: React.FunctionComponent;
	readonly ticks: number;
	readonly totalTicks: number;
	readonly stacks: number;
	readonly maxStacks: number;

	init(player: IPlayer): void;
	tick(): void;
	resetTicks(): void;
	resetStacks(): void;
	isTimeBased(): boolean;
	addStack(): void;
}
