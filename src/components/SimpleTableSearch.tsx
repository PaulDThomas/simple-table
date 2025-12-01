import { useContext } from "react";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableSearch.module.css";

export const SimpleTableSearch = (): React.ReactElement => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <div className={styles.holder}>
      <label
        id={`${simpleTableContext.id}-search-label`}
        htmlFor={`${simpleTableContext.id}-search`}
        className={simpleTableContext.searchLabelClassName}
      >
        {simpleTableContext.searchLabel ?? "Search"}
      </label>
      <div>
        <input
          id={`${simpleTableContext.id}-search`}
          className={simpleTableContext.searchInputClassName}
          role="searchbox"
          type="string"
          value={simpleTableContext.searchText ?? ""}
          disabled={!simpleTableContext.setSearchText}
          onChange={(e) => {
            simpleTableContext.setSearchText(e.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
};

SimpleTableSearch.displayName = "SimpleTableSearch";
