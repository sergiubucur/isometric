import styled from "styled-components/macro";

import { GlobalCooldownTotalFrames } from "../../entity/player/spell-engine/PlayerSpellEngine";

const Margin = 28;
const ButtonSize = 48;
const BackgroundColor = "#002040";
const ForegroundColor = "#2080C0";

export const SpellBarContainer = styled.div`
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: ${Margin}px;
	user-select: none;
	box-sizing: border-box;
	color: #fff;
	display: flex;
`;

export type IconContainerProps = {
	active: boolean,
	unusable: boolean
};

export const IconContainer = styled.div<IconContainerProps>`
	margin: 4px;
	width: ${ButtonSize}px;
	height: ${ButtonSize}px;
	box-sizing: border-box;
	outline: ${props => props.active ? "2px solid #fff" : "2px solid #000"};
	background: ${BackgroundColor};
	font-size: 26px;
	position: relative;
	filter: ${props => props.unusable ? "brightness(0.25)" : "none"};
`;

export const IconInner = styled.div`
	border: 2px solid ${ForegroundColor};
	width: ${ButtonSize}px;
	height: ${ButtonSize}px;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const IconBadge = styled.div`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	outline: 2px solid #000;
	top: -24px;
	font-size: 12px;
	background: ${BackgroundColor};
	border: 2px solid ${ForegroundColor};
	width: 32px;
	text-align: center;
`;

export type IconCooldownOverlayProps = {
	cooldown: number
};

export const IconCooldownOverlay = styled.div.attrs<IconCooldownOverlayProps>(props => ({
	height: `${Math.floor((props.cooldown / GlobalCooldownTotalFrames) * ButtonSize)}px`
}))<IconCooldownOverlayProps>`
	position: absolute;
	left: 0;
	top: 0;
	background: #000;
	opacity: 0.75;
	width: ${ButtonSize}px;
`;
