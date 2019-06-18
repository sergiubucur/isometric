import { GlobalCooldownTotalFrames } from "../../entity/player/spell-engine/PlayerSpellEngine";

const Margin = 28;
const ButtonSize = 48;
const BackgroundColor = "#002040";
const ForegroundColor = "#2080C0";

export const containerStyles: any = {
	position: "fixed",
	left: "50%",
	transform: "translateX(-50%)",
	bottom: Margin,
	userSelect: "none",
	boxSizing: "border-box",
	color: "#fff",
	display: "flex"
};

export const iconStyles: any = (active: boolean, unusable: boolean) => ({
	margin: 4,
	width: ButtonSize,
	height: ButtonSize,
	boxSizing: "border-box",
	outline: active ? "2px solid #fff" : "2px solid #000",
	background: BackgroundColor,
	fontSize: 26,
	position: "relative",
	filter: unusable ? "brightness(0.25)" : "none"
});

export const iconInnerStyles: any = {
	border: `2px solid ${ForegroundColor}`,
	width: ButtonSize,
	height: ButtonSize,
	boxSizing: "border-box",
	display: "flex",
	justifyContent: "center",
	alignItems: "center"
};

export const iconBadgeStyles: any = {
	position: "absolute",
	left: "50%",
	transform: "translateX(-50%)",
	outline: "2px solid #000",
	top: -24,
	fontSize: 12,
	background: BackgroundColor,
	border: `2px solid ${ForegroundColor}`,
	width: 32,
	textAlign: "center"
};

export const iconCooldownOverlayStyles: any = (cooldown: number) => {
	const ratio = cooldown / GlobalCooldownTotalFrames;

	return {
		position: "absolute",
		left: 0,
		top: 0,
		background: "#000",
		opacity: 0.75,
		width: ButtonSize,
		height: Math.floor(ratio * ButtonSize)
	};
};
