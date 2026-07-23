import { ISimpleTableField, SimpleTableNullDate, simpleTableSortFn } from "../src/main";

export const mockFields: ISimpleTableField[] = [
  { name: "id", hidden: true },
  { name: "n", label: "N", renderFn: ({ rowNumber }) => <>{rowNumber}</> },
  {
    name: "first_name",
    label: "First name",
    searchFn: (rowData, searchText) =>
      (rowData.first_name as string).toLowerCase().includes(searchText.toLowerCase().trim()),
    sortFn: simpleTableSortFn,
    width: "100px",
  },
  {
    name: "last_name",
    label: "Surname",
    searchFn: (rowData, searchText) =>
      (
        `${
          rowData.last_name instanceof Date ? rowData.last_name.toDateString() : rowData.last_name
        }` as string
      )
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    sortFn: simpleTableSortFn,
    renderFn: SimpleTableNullDate,
    width: "120px",
    canColumnFilter: true,
  },
  {
    name: "car_make",
    label: "Make",
    searchFn: (rowData, searchText) =>
      ((rowData.car_make as string | null) ?? "")
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    headerRenderFn: ({ columnNumber, field }) => (
      <>
        {columnNumber}:{" "}
        <span
          style={{ color: "green" }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            console.log("Drag end", e);
          }}
        >
          {field.name}
        </span>
      </>
    ),
    sortFn: simpleTableSortFn,
    renderFn: ({ rowData }) => {
      return rowData.car_make ? (
        <div className="overflow-hidden">
          {rowData.car_make === "Ford" ? "Another FORD classic" : `${rowData.car_make}`}
        </div>
      ) : (
        <div>No car</div>
      );
    },
    filterOutFn: (rowData) => (rowData.car_make as string | null) === null,
    width: "140px",
    canColumnFilter: true,
  },
  {
    name: "car_model",
    label: "Model",
    searchFn: (rowData, searchText) =>
      ((rowData.car_model as string | null) ?? "")
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    sortFn: simpleTableSortFn,
    width: "160px",
    canColumnFilter: true,
  },
  {
    name: "tags",
    label: "Tags",
    searchFn: (rowData, searchText) =>
      ((rowData.tags as string[] | undefined) ?? []).some((tag) =>
        tag.toLowerCase().includes(searchText.toLowerCase().trim()),
      ),
    width: "160px",
    canColumnFilter: true,
    renderFn: ({ rowData }) => {
      const tags = rowData.tags as string[] | undefined;
      if (!tags || tags.length === 0) {
        return <div>No tags</div>;
      }
      return (
        <div
          className="overflow-hidden"
          style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
        >
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{ border: "1px solid #ccc", padding: "2px 4px", borderRadius: "4px" }}
            >
              {tag}
            </span>
          ))}
        </div>
      );
    },
  },
];
