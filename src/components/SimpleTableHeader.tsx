import { useCallback, useContext, useRef } from "react";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableHeader.module.css";
import { SimpleTableHeaderContents } from "./SimpleTableHeaderContents";

export const SimpleTableHeader = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);
  const targetCell = useRef<HTMLTableCellElement | null>(null);

  const mouseMove = useCallback((e: MouseEvent) => {
    if (targetCell.current !== null) {
      const t = targetCell.current as HTMLTableCellElement;
      const width = e.clientX - window.scrollX - t.getBoundingClientRect().x;
      if (width > 16) {
        t.style.width = `${width}px`;
      }
    }
  }, []);

  const mouseUp = useCallback(() => {
    if (targetCell.current) {
      const name = targetCell.current.dataset.columnName;
      const width = targetCell.current.style.width;
      if (simpleTableContext.setColumnWidth && name && width) {
        simpleTableContext.setColumnWidth(name, targetCell.current.style.width);
      }
      targetCell.current = null;
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    }
  }, [mouseMove, simpleTableContext]);

  const mouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      targetCell.current = (e.currentTarget as HTMLDivElement)
        .parentElement as HTMLTableCellElement;
      if (targetCell.current) {
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", mouseUp);
      }
    },
    [mouseMove, mouseUp],
  );

  return (
    <>
      {simpleTableContext.fields
        .filter((f) => !f.hidden)
        .map((field, columnNumber) => {
          return (
            <th
              id={`${simpleTableContext.id}-header-${field.name}`}
              key={field.name}
              data-column-name={field.name}
              className={styles.cell}
              style={{
                width:
                  simpleTableContext.columnWidths.find((w) => w.name === field.name)?.width ??
                  "100px",
              }}
            >
              <SimpleTableHeaderContents
                field={field}
                columnNumber={columnNumber}
              />
              <div
                aria-orientation="vertical"
                tabIndex={columnNumber}
                className={styles.resizeHandle}
                role="separator"
                onMouseDown={mouseDown}
              />
            </th>
          );
        })}
    </>
  );
};

SimpleTableHeader.displayName = "SimpleTableHeader";
