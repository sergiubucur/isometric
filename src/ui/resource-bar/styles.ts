import styled from "styled-components/macro";

export const Margin = 32;
export const Width = 256;
export const Height = 32;

export const Text = styled.div`
	position: fixed;
	bottom: ${Margin + Height + Margin / 2}px;
	font-size: 22px;
	color: #fff;
	text-shadow: "2px 2px 0px #000";
	user-select: none;
`;

export const Container = styled.div`
	position: fixed;
	bottom: ${Margin}px;
	width: ${Width}px;
	height: ${Height}px;
	outline: 2px solid #000;
	user-select: none;
	box-sizing: border-box;
	overflow: hidden;
`;

export const Value = styled.div`
	margin: 3px;
	height: ${Height - 10}px;
`;
