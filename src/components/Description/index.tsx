import React from "react";

import * as S from "./styles";

type DescriptionProps = {
  children: React.ReactNode;
};

const Description = ({ children }: DescriptionProps) => {
  return <S.Container>{children}</S.Container>;
};

export default Description;
