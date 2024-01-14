import React from "react";
import { Attribute, AttributeLabel, AttributeValue } from "../../Attribute";
interface IOverviewPros {
  data: any;
}

const attributes = [
  {
    title: "Registration Id",
    value: "registrationId",
  },
  {
    title: "Model",
    value: "model",
  },
  {
    title: "Color",
    value: "color",
  },
  {
    title: "Location",
    value: "location",
  },
];
export const Overview = (props: IOverviewPros) => {
  const { data } = props;
  return (
    <>
      {attributes.map((el: any, i) => {
        return (
          <Attribute key={i}>
            <AttributeLabel> {el.title}</AttributeLabel>
            <AttributeValue>{data[el.value]}</AttributeValue>
          </Attribute>
        );
      })}
    </>
  );
};
