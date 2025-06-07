import { useContext } from "react";
import { ISimpleTableField } from "./interface";
import { SimpleTableColumnFilter } from "./SimpleTableColumnFilter";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableHeaderContents.module.css";
import { FilterActiveSvg, FilterInactiveSvg, SortAscSvg, SortDescSvg } from "./Svgs";

interface ISimspleTableHeaderContentsProps {
  field: ISimpleTableField;
  columnNumber: number;
}

export const SimpleTableHeaderContents = ({
  field,
  columnNumber,
}: ISimspleTableHeaderContentsProps): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <>
      {field.canColumnFilter && (
        <div className={styles.cellBottomLeft}>
          <div className={styles.insideCellBottomLeft}>
            <div
              className={styles.filterHolder}
              style={{
                visibility:
                  simpleTableContext.currentColumnFilter === columnNumber ? "visible" : "hidden",
              }}
            >
              <SimpleTableColumnFilter columnName={field.name} />
            </div>
          </div>
        </div>
      )}
      <div className={styles.text}>
        <span
          className={field.sortFn ? styles.clickable : undefined}
          onClick={() => {
            if (field.sortFn) simpleTableContext.updateSortBy?.(field);
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
            <span>
              {simpleTableContext.currentColumnItems.find((cf) => cf.columnName === field.name)
                ?.values.length ===
              simpleTableContext.currentColumnFilters.find((cf) => cf.columnName === field.name)
                ?.values.length ? (
                <FilterInactiveSvg
                  aria-label="Column filter"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    simpleTableContext.setCurrentColumnFilter?.(
                      simpleTableContext.currentColumnFilter !== columnNumber ? columnNumber : null,
                    );
                  }}
                />
              ) : (
                <FilterActiveSvg
                  aria-label="Column filter (Active)"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    simpleTableContext.setCurrentColumnFilter?.(
                      simpleTableContext.currentColumnFilter !== columnNumber ? columnNumber : null,
                    );
                  }}
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
