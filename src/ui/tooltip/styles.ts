import styled from "styled-components/macro";
import { HighlightColor } from "../common/Highlight";

export const Margin = 32;
export const Padding = 16;

export const Container = styled.div`
	display: block;
	width: 256px;
	background: #000;
	color: #fff;
	font-size: 16px;
	position: fixed;
	right: ${Margin}px;
	bottom: 160px;
	outline: 2px solid #808080;
	opacity: 0.75;
	padding: ${Padding}px;
	user-select: none;
	box-sizing: border-box;
`;

export const Header = styled.div`
	color: ${HighlightColor};
	font-size: 1.2em;
`;

export const Separator = styled.div`
	margin-bottom: 10px;
`;
