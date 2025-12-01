import { useContext } from "react";
import cbStyles from "./SimpleTableCheckBox.module.css";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableFilter.module.css";

export const SimpleTableFilter = (): React.ReactElement => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <div
      className={styles.holder}
      onClick={() =>
        simpleTableContext.setFilterData &&
        simpleTableContext.setFilterData(!simpleTableContext.filterData)
      }
    >
      <div className={cbStyles.checkboxContainer}>
        <input
          id={`${simpleTableContext.id}-filter`}
          type="checkbox"
          role="checkbox"
          className={simpleTableContext.filterCheckClassName}
          checked={
            simpleTableContext.filterData !== undefined ? simpleTableContext.filterData : false
          }
          onChange={() => true}
          aria-labelledby={`${simpleTableContext.id}-filter-label`}
        />
      </div>
      <span
        id={`${simpleTableContext.id}-filter-label`}
        className={styles.label}
      >
        {simpleTableContext.filterLabel ?? "Filter"}
      </span>
    </div>
  );
};

SimpleTableFilter.displayName = "SimpleTableFilter";
