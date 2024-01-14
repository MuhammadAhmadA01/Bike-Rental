import React from "react";
import { Attribute, AttributeLabel, AttributeValue } from "../../Attribute";
interface IOverviewPros {
  data: any;
}

const attributes = [
  {
    title: "Full Name",
    value: "name",
  },
  {
    title: "Email",
    value: "email",
  },
  {
    title: "Father Name",
    value: "fatherName",
  },
  {
    title: "Age",
    value: "age",
  },
  {
    title: "Role",
    value: "isManager",
    custom: {
      name: "getRole",
    },
  },
];
export const Overview = (props: IOverviewPros) => {
  const { data } = props;
  const renderCustom = (attribute: any, _data: any) => {
    switch (attribute.custom.name) {
      case "getRole":
        return data[attribute.value] ? "Manager" : "User";

      default:
        return "-";
    }
  };
  return (
    <div>
      {attributes.map((el, i) => {
        return (
          <Attribute key={i}>
            <AttributeLabel> {el.title}</AttributeLabel>
            <AttributeValue>
              {el.custom ? renderCustom(el, data) : data[el.value]}
            </AttributeValue>
          </Attribute>
        );
      })}
    </div>
  );
};
