import { iSimpleTableField } from "../interface";

interface iSimspleTableHeaderContentsProps {
  field: iSimpleTableField;
  columnNumber: number;
}

export const SimpleTableHeaderContents = ({
  field,
  columnNumber,
}: iSimspleTableHeaderContentsProps): JSX.Element => {
  return (
    <>
      {columnNumber}:{field.name}
    </>
  );
};
