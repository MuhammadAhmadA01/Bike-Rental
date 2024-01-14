import { FC } from "react";
import { styled } from "@mui/system";

export interface IAttributeProps {
  className?: string;
  children: any;
}

const StyledDiv = styled("div")({
  display: "flex",
  padding: "4px 0px",
  flexDirection: "row",
});

export const Attribute: FC<IAttributeProps> = (props) => {
  return <StyledDiv>{props.children}</StyledDiv>;
};

export * from "./AttributeLabel";
export * from "./AttributeValue";
