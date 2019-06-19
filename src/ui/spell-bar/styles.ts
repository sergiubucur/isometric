import styled from "styled-components/macro";

export const Margin = 52;
export const ButtonSize = 48;
export const BackgroundColor = "#002040";
export const ForegroundColor = "#2080C0";

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

export const IconOuter = styled.div`
	position: relative;
`;

export const IconContainer = styled.div`
	margin: 4px;
	width: ${ButtonSize}px;
	height: ${ButtonSize}px;
	box-sizing: border-box;
	background: ${BackgroundColor};
	font-size: 26px;
	position: relative;

	&:hover {
		box-shadow: inset 0px 0px 10px 0px rgba(255,255,255,1);
	}
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
	top: -22px;
	font-size: 12px;
	background: ${BackgroundColor};
	border: 2px solid ${ForegroundColor};
	width: 32px;
	text-align: center;
`;

export const IconCooldownOverlay = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	background: #000;
	opacity: 0.75;
	width: ${ButtonSize}px;
`;
