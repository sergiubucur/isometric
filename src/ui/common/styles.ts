import styled from "styled-components/macro";

export type IconContainerProps = {
	flip: boolean
};

export const IconContainer = styled.i<IconContainerProps>`
	transform: ${props => props.flip ? "rotateY(180deg)" : "none"}
`;
