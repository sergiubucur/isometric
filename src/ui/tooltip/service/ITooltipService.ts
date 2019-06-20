import React from "react";

export default interface ITooltipService {
	readonly current: React.FunctionComponent;

	show(content: React.FunctionComponent): void;
	hide(): void;
}
