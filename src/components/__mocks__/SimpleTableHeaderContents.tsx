import React from "react";
import { ISimpleTableField } from "../interface";

interface ISimspleTableHeaderContentsProps {
  field: ISimpleTableField;
  columnNumber: number;
}

export const SimpleTableHeaderContents = ({
  field,
  columnNumber,
}: ISimspleTableHeaderContentsProps): React.JSX.Element => {
  return (
    <>
      {columnNumber}:{field.name}
    </>
  );
};
