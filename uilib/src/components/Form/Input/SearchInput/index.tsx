import React from "react";
import Input, { InputProps, InputRenderLeftContainer } from "@components/Form/Input/BaseInput";
//import SearchMedium from "@ui/assets/icons/SearchMedium";
import SearchMedium from "@ui/assets/icons/raw/medium/search.svg";
import styled from "styled-components";

// const Icon = styled(SearchMedium).attrs((p) => ({
//   color: p.theme.colors.palette.neutral.c70,
// }))``;

export default function SearchInput(props: InputProps): JSX.Element {
  return (
    <Input
      {...props}
      renderLeft={
        <InputRenderLeftContainer>
          <SearchMedium width={16} height={16} />
        </InputRenderLeftContainer>
      }
    />
  );
}
