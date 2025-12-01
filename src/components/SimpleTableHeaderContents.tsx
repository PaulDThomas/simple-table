import React, { useContext, useRef } from "react";
import { ISimpleTableField } from "./interface";
import { SimpleTableColumnFilter } from "./SimpleTableColumnFilter";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableHeaderContents.module.css";
import { SimpleTablePopover } from "./SimpleTablePopover";
import { FilterActiveSvg, FilterInactiveSvg, SortAscSvg, SortDescSvg } from "./Svgs";

interface ISimspleTableHeaderContentsProps {
  field: ISimpleTableField;
  columnNumber: number;
}

export const SimpleTableHeaderContents = ({
  field,
  columnNumber,
}: ISimspleTableHeaderContentsProps): React.JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);
  const filterIconRef = useRef<HTMLSpanElement>(null);

  const isFilterActive = simpleTableContext.currentColumnFilter === columnNumber;
  const thisColumnFilter = simpleTableContext.currentColumnFilters.find(
    (cf) => cf.columnName === field.name,
  )?.values;
  const thisColumnItems = simpleTableContext.currentColumnItems.find(
    (cf) => cf.columnName === field.name,
  )?.values;

  const toggleFilter: React.MouseEventHandler<SVGSVGElement> = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    simpleTableContext.setCurrentColumnFilter?.(
      simpleTableContext.currentColumnFilter !== columnNumber ? columnNumber : null,
    );
  };

  return (
    <>
      {field.canColumnFilter && (
        <SimpleTablePopover
          isVisible={isFilterActive}
          anchorElementRef={filterIconRef}
          onClose={() => simpleTableContext.setCurrentColumnFilter(null)}
        >
          <SimpleTableColumnFilter columnName={field.name} />
        </SimpleTablePopover>
      )}
      <div className={styles.text}>
        <span
          className={field.sortFn ? styles.clickable : undefined}
          onClick={() => {
            if (field.sortFn) simpleTableContext.updateSortBy(field);
          }}
        >
          <span className={simpleTableContext.sortBy?.name === field.name ? "sorted" : "unsorted"}>
            {field.headerRenderFn ? (
              <>{field.headerRenderFn({ field, columnNumber })}</>
            ) : (
              <>{field.label}</>
            )}
          </span>
        </span>
        <div className={styles.iconHolder}>
          {simpleTableContext.sortBy?.name === field.name ? (
            simpleTableContext.sortBy?.asc ? (
              <SortAscSvg />
            ) : (
              <SortDescSvg />
            )
          ) : undefined}
          {field.canColumnFilter && (
            <span ref={filterIconRef}>
              {thisColumnFilter && thisColumnFilter.length !== thisColumnItems?.length ? (
                <FilterActiveSvg
                  aria-label="Column filter (Active)"
                  onClick={toggleFilter}
                />
              ) : (
                <FilterInactiveSvg
                  aria-label="Column filter"
                  onClick={toggleFilter}
                />
              )}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

SimpleTableHeaderContents.displayName = "SimpleTableHeaderContents";
