const Margin = 32;
const Width = 256;
const Height = 32;

export const textStyles = (side: "left" | "right") => ({
	position: "fixed",
	[side]: Margin,
	bottom: Margin + Height + Margin / 2,
	fontSize: 22,
	color: "#fff",
	textShadow: "2px 2px 0px #000",
	userSelect: "none"
} as any);

export const containerStyles = (foregroundColor: string, backgroundColor: string, side: "left" | "right") => ({
	position: "fixed",
	[side]: Margin,
	bottom: Margin,
	width: Width,
	height: Height,
	border: `2px solid ${foregroundColor}`,
	outline: "2px solid #000",
	background: backgroundColor,
	userSelect: "none",
	boxSizing: "border-box",
	overflow: "hidden"
} as any);

export const valueStyles = (value: number, total: number, foregroundColor: string) => ({
	margin: "3px",
	width: Math.floor((value / total) * Width) - 10,
	height: Height - 10,
	background: foregroundColor
} as any);
