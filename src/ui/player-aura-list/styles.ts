import styled from "styled-components/macro";
import { BackgroundColor, ForegroundColor } from "../spell-bar/styles";

export const TopMargin = 30;
export const RightMargin = 306;
export const IconSize = 32;

export const Container = styled.div`
	position: fixed;
	top: ${TopMargin}px;
	right: ${RightMargin}px;
	display: flex;
	user-select: none;
`;

export const IconContainer = styled.div`
	font-size: 26px;
	margin-left: 8px;
	width: ${IconSize}px;
	height: ${IconSize}px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 2px solid ${ForegroundColor};
	background: ${BackgroundColor};

	&:hover {
		box-shadow: inset 0px 0px 5px 0px rgba(255,255,255,1);
	}
`;
