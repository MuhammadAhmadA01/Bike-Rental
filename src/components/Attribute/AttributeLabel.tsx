import { FC } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

export interface IAttributeLabelProps {
  children: any;
}

const StyledDiv = styled("div")({
  fontSize: "14px",
  lineHeight: 1.33,
  color: "#9f9c9c",
  minWidth: "120px",
  display: "block",
  wordBreak: "break-word",
  padding: "10px",
  fontWeight: "bold",
});
export const AttributeLabel: FC<IAttributeLabelProps> = (props) => {
  return <StyledDiv>{props.children}</StyledDiv>;
};
