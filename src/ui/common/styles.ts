import { keyframes, css } from "styled-components/macro";

const fadeInKeyframes = keyframes`
	from { opacity: 0; }
`;

export const flickerAnimation = css`
	animation: ${fadeInKeyframes} 1s infinite alternate;
`;
