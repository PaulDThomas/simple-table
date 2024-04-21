import { iSimpleTableCellRenderProps } from "../components";

export const simpleTableNullDate = ({
  rowData,
  cellField,
}: iSimpleTableCellRenderProps): JSX.Element => {
  return (
    <>
      {rowData[cellField] instanceof Date
        ? `${new Date(
            (rowData[cellField] as Date).getTime() -
              (rowData[cellField] as Date).getTimezoneOffset() * 60000,
          )
            .toISOString()
            .replace(/[T]/, " ")
            .slice(0, 16)}`
        : rowData[cellField] === null
          ? ""
          : rowData[cellField]}
    </>
  );
};
