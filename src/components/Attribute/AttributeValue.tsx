import { styled } from "@mui/system";
import { isNilOrEmpty } from "../../utils";

export interface IAttributeValueProps {
  className?: string;
  children?: any;
}

const StyledDiv = styled("div")({
  fontSize: "14px",
  lineHeight: 1.33,
  color: "black",
  width: "100%",
  display: "block",
  wordBreak: "break-word",
  wordWrap: "break-word",
  padding: "10px",
});
export const AttributeValue = (props) => {
  return (
    <StyledDiv>{isNilOrEmpty(props.children) ? "-" : props.children}</StyledDiv>
  );
};
