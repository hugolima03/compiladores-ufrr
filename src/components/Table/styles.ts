import styled, { css } from "styled-components";

export const Table = styled.table`
  ${({ theme }) => css`
    color: ${theme.colors.black};

    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    border-radius: rem;
    overflow: hidden;

    th,
    td {
      padding: 12px 15px;
    }

    tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    tbody tr:last-of-type {
      border-bottom: 2px solid ${theme.colors.blue};
    }
  `}
`;

export const TableHeader = styled.th`
  ${({ theme }) => css`
    background-color: ${theme.colors.blue};
    color: #ffffff;
    text-align: left;
  `}
`;

export const TableRow = styled.tr``;

export const TableDatacell = styled.td`
  border-collapse: collapse;
  background-color: white;
`;
