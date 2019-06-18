import React from "react";

export default interface ITooltipService {
	show(content: React.FunctionComponent): void;
	hide(): void;
}
