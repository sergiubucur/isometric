import React from "react";
import IPlayer from "../IPlayer";

export default interface IAura {
	readonly name: string;
	readonly iconName: string;
	readonly flipIcon: boolean;
	readonly tooltip: React.FunctionComponent;
	readonly ticks: number;
	readonly totalTicks: number;

	init(player: IPlayer): void;
	tick(): void;
	reset(): void;
	isTimeBased(): boolean;
}
