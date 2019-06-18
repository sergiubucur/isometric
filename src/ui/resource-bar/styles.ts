import styled from "styled-components/macro";

const Margin = 32;
const Width = 256;
const Height = 32;

export type TextProps = {
	side: "left" | "right"
};

export const Text = styled.div<TextProps>`
	position: fixed;
	${props => props.side}: ${Margin}px;
	bottom: ${Margin + Height + Margin / 2}px;
	font-size: 22px;
	color: #fff;
	text-shadow: "2px 2px 0px #000";
	user-select: none;
`;

export type ContainerProps = {
	foregroundColor: string,
	backgroundColor: string,
	side: "left" | "right"
};

export const Container = styled.div<ContainerProps>`
	position: fixed;
	${props => props.side}: ${Margin}px;
	bottom: ${Margin}px;
	width: ${Width}px;
	height: ${Height}px;
	border: 2px solid ${props => props.foregroundColor};
	outline: 2px solid #000;
	background: ${props => props.backgroundColor};
	user-select: none;
	box-sizing: border-box;
	overflow: hidden;
`;

export type ValueProps = {
	value: number,
	total: number,
	foregroundColor: string
};

export const Value = styled.div.attrs<ValueProps>(props => ({
	width: `${Math.max(Math.floor((props.value / props.total) * Width) - 10, 0)}px`
}))<ValueProps>`
	margin: 3px;
	height: ${Height - 10}px;
	background: ${props => props.foregroundColor};
`;
