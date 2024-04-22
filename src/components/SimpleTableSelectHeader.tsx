import { useContext, useEffect, useRef } from "react";
import { SimpleTableContext } from "./SimpleTableContext";

export const SimpleTableSelectHeader = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);
  const allCheck = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (allCheck.current) {
      if (simpleTableContext.currentSelection?.length === simpleTableContext.totalRows) {
        allCheck.current.checked = true;
        allCheck.current.indeterminate = false;
      } else if ((simpleTableContext.currentSelection?.length ?? 0) === 0) {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = false;
      } else {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = true;
      }
    }
  }, [simpleTableContext.currentSelection?.length, simpleTableContext.totalRows]);

  return (
    <th
      className="simpletable-box-header simpletable-firstcol"
      style={{
        backgroundColor: simpleTableContext.headerBackgroundColor,
      }}
    >
      <div className="simpletable-header-text">
        <input
          id={`${simpleTableContext.id}-check-all`}
          type="checkbox"
          role="checkbox"
          className={simpleTableContext.filterCheckClassName}
          ref={allCheck}
          onChange={() => {
            simpleTableContext.toggleAllCurrentSelection &&
              simpleTableContext.toggleAllCurrentSelection();
          }}
        />
      </div>
    </th>
  );
};

SimpleTableSelectHeader.displayName = "SimpleTableSelectHeader";
