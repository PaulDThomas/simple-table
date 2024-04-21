import { ISimpleTableField } from "../interface";

interface iSimspleTableHeaderContentsProps {
  field: ISimpleTableField;
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
