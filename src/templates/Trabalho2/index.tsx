import React from "react";

import CodeEditor from "components/CodeEditor";

import * as S from "./styles";

const Trabalho2Template = () => {
  function onSubmit(code: string) {
    console.log(code);
  }

  return (
    <S.Container>
      <CodeEditor title="Analisador de Lexemas" onSubmit={onSubmit} />

      <S.Table>
        <S.TableRow>
          <S.TableHeader>Lexema</S.TableHeader>
          <S.TableHeader>Rótulo</S.TableHeader>
          <S.TableHeader>Código</S.TableHeader>
        </S.TableRow>
        <S.TableRow>
          <S.TableDatacell>x</S.TableDatacell>
          <S.TableDatacell>ID</S.TableDatacell>
          <S.TableDatacell>1</S.TableDatacell>
        </S.TableRow>
        <S.TableRow>
          <S.TableDatacell>=</S.TableDatacell>
          <S.TableDatacell>=</S.TableDatacell>
          <S.TableDatacell>2</S.TableDatacell>
        </S.TableRow>
      </S.Table>
    </S.Container>
  );
};

export default Trabalho2Template;
