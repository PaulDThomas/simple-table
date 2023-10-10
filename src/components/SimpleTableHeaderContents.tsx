import { useContext } from "react";
import { SimpleTableColumnFilter } from "./SimpleTableColumnFilter";
import { SimpleTableContext } from "./SimpleTableContext";
import { iSimpleTableField } from "./interface";

interface iSimspleTableHeaderContentsProps {
  field: iSimpleTableField;
  columnNumber: number;
}

export const SimpleTableHeaderContents = ({
  field,
  columnNumber,
}: iSimspleTableHeaderContentsProps): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <>
      {field.canColumnFilter && (
        <div
          className='simpletable-columnfilter-holder small-scrollbar'
          style={{
            backgroundColor: simpleTableContext.headerBackgroundColor,
            visibility:
              simpleTableContext.currentColumnFilter === columnNumber ? "visible" : "hidden",
          }}
        >
          <SimpleTableColumnFilter columnName={field.name} />
        </div>
      )}
      <div className='simpletable-header-text'>
        <span
          className={field.sortFn ? "simpletable-clickable" : "simple-table-nosorting"}
          onClick={() => {
            field.sortFn &&
              simpleTableContext.updateSortBy &&
              simpleTableContext.updateSortBy(field);
          }}
        >
          <span className={simpleTableContext.sortBy?.name === field.name ? "sorted" : "unsorted"}>
            {field.headerRenderFn ? (
              <div className='simpletable-header-text'>
                {field.headerRenderFn({ field, columnNumber })}
              </div>
            ) : (
              <>{field.label}</>
            )}
          </span>
        </span>
        <div className='columnicon-holder'>
          {field.canColumnFilter && (
            <span>
              {simpleTableContext.currentColumnItems.find((cf) => cf.columnName === field.name)
                ?.values.length ===
              simpleTableContext.currentColumnFilters.find((cf) => cf.columnName === field.name)
                ?.values.length ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                  aria-label='Column filter'
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    simpleTableContext.setCurrentColumnFilter &&
                      simpleTableContext.setCurrentColumnFilter(
                        simpleTableContext.currentColumnFilter !== columnNumber
                          ? columnNumber
                          : null,
                      );
                  }}
                >
                  <path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z' />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                  aria-label='Column filter (Active)'
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    simpleTableContext.setCurrentColumnFilter &&
                      simpleTableContext.setCurrentColumnFilter(
                        simpleTableContext.currentColumnFilter !== columnNumber
                          ? columnNumber
                          : null,
                      );
                  }}
                >
                  <path d='M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z' />
                </svg>
              )}
            </span>
          )}
          {simpleTableContext.sortBy?.name === field.name ? (
            simpleTableContext.sortBy?.asc ? (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                </svg>
              </>
            ) : (
              <>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                </svg>
              </>
            )
          ) : undefined}
        </div>
      </div>
    </>
  );
};

SimpleTableHeaderContents.displayName = "SimpleTableHeaderContents";
