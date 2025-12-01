import { useContext, useEffect, useRef } from "react";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableSelectHeader.module.css";

export const SimpleTableSelectHeader = (): React.ReactElement => {
  const simpleTableContext = useContext(SimpleTableContext);
  const allCheck = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // istanbul ignore else
    if (allCheck.current) {
      if (simpleTableContext.currentSelection?.length === simpleTableContext.totalRows) {
        allCheck.current.checked = true;
        allCheck.current.indeterminate = false;
      } else if (simpleTableContext.currentSelection.length === 0) {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = false;
      } else {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = true;
      }
    }
  }, [simpleTableContext.currentSelection.length, simpleTableContext.totalRows]);

  return (
    <th className={styles.cell}>
      <div>
        <input
          id={`${simpleTableContext.id}-check-all`}
          type="checkbox"
          role="checkbox"
          className={simpleTableContext.filterCheckClassName}
          ref={allCheck}
          onChange={simpleTableContext.toggleAllCurrentSelection}
        />
      </div>
    </th>
  );
};

SimpleTableSelectHeader.displayName = "SimpleTableSelectHeader";
