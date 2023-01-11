import React from "react";

import * as S from "./styles";

type BaseProps = {
  children: React.ReactNode;
};

const Base = ({ children }: BaseProps) => {
  return <S.Main>{children}</S.Main>;
};

export default Base;
