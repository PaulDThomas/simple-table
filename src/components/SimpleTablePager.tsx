import { useContext } from "react";
import selectStyles from "./Select.module.css";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTablePager.module.css";
import { PagerEndSvg, PagerNextSvg, PagerPrevSvg, PagerStartSvg } from "./Svgs";

export const SimpleTablePager = (): React.JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <div className={styles.footer}>
      <span>
        Showing&nbsp;
        <select
          id={`${simpleTableContext.id}-pager-visible-rows`}
          aria-label="Visible rows"
          className={selectStyles.baseSelect}
          value={`${
            simpleTableContext.pageRows === Infinity ? "All" : simpleTableContext.pageRows
          }`}
          onChange={(e) =>
            simpleTableContext.setPageRows &&
            simpleTableContext.setPageRows(
              e.currentTarget.value === "All" ? Infinity : parseInt(e.currentTarget.value),
            )
          }
        >
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
          <option>250</option>
          <option>500</option>
          <option>All</option>
        </select>
        &nbsp;of&nbsp;{simpleTableContext.viewData.length}&nbsp;rows
        {simpleTableContext.viewData.length !== simpleTableContext.totalRows &&
          ` (${simpleTableContext.totalRows} unfiltered)`}
        &nbsp;from&nbsp;
        <PagerStartSvg
          aria-label="Go to first page"
          onClick={() => simpleTableContext.setFirstRow && simpleTableContext.setFirstRow(0)}
        />
        <PagerPrevSvg
          aria-label="Go to previous page"
          onClick={() =>
            simpleTableContext.setFirstRow &&
            simpleTableContext.setFirstRow(
              Math.max(0, simpleTableContext.firstRow - simpleTableContext.pageRows),
            )
          }
        />
        row&nbsp;
        <select
          id={`${simpleTableContext.id}-pager-first-row`}
          aria-label="First row"
          className={selectStyles.baseSelect}
          value={simpleTableContext.firstRow}
          onChange={(e) => {
            simpleTableContext.setFirstRow(parseInt(e.currentTarget.value));
          }}
        >
          {simpleTableContext.pageRows === Infinity ? (
            <option>1</option>
          ) : (
            Array.from(
              {
                length: Math.ceil(simpleTableContext.viewData.length / simpleTableContext.pageRows),
              },
              (_, i) => i * simpleTableContext.pageRows,
            ).map((rn) => (
              <option
                key={rn}
                value={rn}
              >
                {rn + 1}
              </option>
            ))
          )}
        </select>
        <PagerNextSvg
          aria-label="Go to next page"
          onClick={() =>
            simpleTableContext.setFirstRow &&
            simpleTableContext.firstRow + simpleTableContext.pageRows <
              simpleTableContext.viewData.length &&
            simpleTableContext.setFirstRow(
              simpleTableContext.firstRow + simpleTableContext.pageRows,
            )
          }
        />
        <PagerEndSvg
          aria-label="Go to last page"
          onClick={() => {
            simpleTableContext.setFirstRow(
              Math.floor((simpleTableContext.viewData.length - 1) / simpleTableContext.pageRows) *
                simpleTableContext.pageRows,
            );
          }}
        />
      </span>
    </div>
  );
};

SimpleTablePager.displayName = "SimpleTablePager";
