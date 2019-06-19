import styled from "styled-components/macro";

export const Container = styled.div`
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	font-size: 30px;
	user-select: none;
	padding: 16px;
	text-align: center;
	text-shadow: 2px 2px 0px #000;
`;

export const Title = styled.div`
	font-size: 2em;
	margin-bottom: 32px;
`;
