import styled from "styled-components/macro";
import UIConstants from "../common/UIConstants";
import { flickerAnimation } from "../common/styles";

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

type IconContainerProps = {
	flicker?: boolean;
};

export const IconContainer = styled.div<IconContainerProps>`
	font-size: 26px;
	margin-left: 8px;
	width: ${IconSize}px;
	height: ${IconSize}px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 2px solid ${UIConstants.ManaLightColor};
	background: ${UIConstants.ManaDarkColor};
	position: relative;
	${props => props.flicker && flickerAnimation}

	&:hover {
		box-shadow: inset 0px 0px 5px 0px rgba(255,255,255,1);
	}
`;

export const StackValue = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	font-size: 12px;
	text-shadow: 2px 2px 0px #000;
`;
