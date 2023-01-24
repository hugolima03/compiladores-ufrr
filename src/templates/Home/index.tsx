import React from "react";
import Image from "next/image";

import Base from "../Base";

import * as S from "./styles";
import Link from "next/link";

const HomeTemplate = () => {
  return (
    <Base>
      <S.Wrapper>
        <S.Image src="https://vestibulares2022.com.br/wp-content/uploads/2021/06/ufrr_brasao.png" />

        <h1>DCC605 - CONSTRUÇÃO DE COMPILADORES</h1>

        <S.LinksWrapper>
          <Link href="/Trabalhos/trab1.pdf">Trabalho 1</Link>
          <Link href="/trabalhos/analisadorLexemas">Trabalho 2 - Analisador de Lexemas</Link>
          <Link href="/trabalhos/analisadorLexico">Trabalho 3 - Analisador Léxico</Link>
        </S.LinksWrapper>

        <p>
          Projeto feito por{" "}
          <S.Author href="https://github.com/hugolima03" target="_blank">
            Hugo Lima Romão
          </S.Author>
        </p>
      </S.Wrapper>
    </Base>
  );
};

export default HomeTemplate;
