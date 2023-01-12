import Link from "next/link";
import styled, { css } from "styled-components";

export const Wrapper = styled.section`
  width: 40rem;

  display: flex;
  flex-direction: column;

  align-self: center;
  justify-self: center;

  margin: auto;

  gap: 2.4rem;
`;

export const Image = styled.img`
  width: 6rem;
`;

export const Author = styled(Link)`
  ${({ theme }) => css`
    padding: 0;
    text-transform: none;

    color: white;
    text-decoration: underline;
  `}
`;

export const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 1.6rem;

  a {
    background-color: #46467a;
    padding: 1.6rem;
    border-radius: 0.6rem;
    text-transform: uppercase;
    font-weight: 700;
    color: white;
    transition: all 0.4s;
  }

  a:hover {
    background-color: #7171c7;
    transform: scale(1.05);
  }
`;
