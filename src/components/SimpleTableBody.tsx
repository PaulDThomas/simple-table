import { useContext } from "react";
import styles from "./SimpleTableBody.module.css";
import { SimpleTableContext } from "./SimpleTableContext";
import { SimpleTableRow } from "./SimpleTableRow";

export const SimpleTableBody = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <tbody className={styles.tbody}>
      {simpleTableContext.viewData
        .slice(
          simpleTableContext.firstRow,
          simpleTableContext.firstRow + simpleTableContext.pageRows,
        )
        .map((row, ri) => {
          const chk =
            typeof row[simpleTableContext.keyField] === "string" ||
            typeof row[simpleTableContext.keyField] === "number";
          return chk ? (
            <SimpleTableRow
              key={row[simpleTableContext.keyField] as string | number}
              rowId={row[simpleTableContext.keyField] as string | number}
              rowNumber={ri + simpleTableContext.firstRow}
            />
          ) : (
            <tr key={ri}>
              <td
                colSpan={simpleTableContext.fields.filter((f) => !f.hidden).length}
                className={styles.noKeyField}
              >
                keyField has not been found
              </td>
            </tr>
          );
        })}
    </tbody>
  );
};

SimpleTableBody.displayName = "SimpleTableBody";
