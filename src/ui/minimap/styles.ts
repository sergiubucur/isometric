import styled from "styled-components/macro";

export const Size = 32;
export const CellSize = 8;
export const Zoom = 4;
export const Margin = 32;

export const Container = styled.div`
	position: fixed;
	right: ${Margin}px;
	top: ${Margin}px;
	width: ${CellSize * Size}px;
	height: ${CellSize * Size}px;
	display: flex;
	flex-wrap: wrap;
	opacity: 0.75;
	outline: 2px solid #808080;
	user-select: none;
`;

export const Canvas = styled.canvas`
	width: ${Size * CellSize}px;
	height: ${Size * CellSize}px;
	image-rendering: crisp-edges;
	image-rendering: pixelated;
`;

export const PlayerDot = styled.div`
	position: absolute;
	left: ${Size * CellSize / 2 - 4}px;
	top: ${Size * CellSize / 2 - 4}px;
	width: 8px;
	height: 8px;
	background: #bada55;
	border-radius: 4px;
`;
