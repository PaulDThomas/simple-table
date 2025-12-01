import React, { useContext, useEffect, useRef } from "react";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableHeader.module.css";
import { SimpleTableHeaderContents } from "./SimpleTableHeaderContents";

export const SimpleTableHeader = (): React.ReactElement => {
  const simpleTableContext = useContext(SimpleTableContext);
  const targetCell = useRef<HTMLTableCellElement | null>(null);
  const mouseUpRef = useRef<(() => void) | null>(null);

  const mouseMove = (e: MouseEvent) => {
    // istanbul ignore else
    if (targetCell.current !== null) {
      const t = targetCell.current as HTMLTableCellElement;
      const width = e.clientX - window.scrollX - t.getBoundingClientRect().x;
      if (width > 16) {
        t.style.width = `${width}px`;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mouseUp = () => {
    // istanbul ignore else
    if (targetCell.current) {
      const name = targetCell.current.dataset.columnName;
      const width = targetCell.current.style.width;
      // istanbul ignore else
      if (simpleTableContext.setColumnWidth && name && width) {
        simpleTableContext.setColumnWidth(name, targetCell.current.style.width);
      }
      targetCell.current = null;
      window.removeEventListener("mousemove", mouseMove);
      // istanbul ignore else
      if (mouseUpRef.current) {
        window.removeEventListener("mouseup", mouseUpRef.current);
      }
    }
  };

  // Keep ref updated with latest mouseUp in an effect
  useEffect(() => {
    mouseUpRef.current = mouseUp;
  }, [mouseUp]);

  const mouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    targetCell.current = (e.currentTarget as HTMLDivElement).parentElement as HTMLTableCellElement;
    // istanbul ignore else
    if (targetCell.current) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }
  };

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
