import { ISimpleTableField, simpleTableSortFn } from "../src/main";
import { raw_data } from "./mock_data";

export const mockFields: ISimpleTableField[] = [
  { name: "id", hidden: true },
  { name: "n", label: "N", renderFn: ({ rowNumber }) => <>{rowNumber}</> },
  {
    name: "first_name",
    label: "First name",
    width: "100px",
    canColumnFilter: true,
  },
  {
    name: "last_name",
    label: "Surname",
    width: "120px",
    sortFn: simpleTableSortFn,
    canColumnFilter: true,
  },
  {
    name: "age",
    label: "Age",
    width: "60px",
    sortFn: simpleTableSortFn,
    canColumnFilter: true,
  },
  {
    name: "dob",
    label: "DOB",
    sortFn: simpleTableSortFn,
  },
  {
    name: "car",
    label: "Car",
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
      const rowDataTyped = rowData as RowData;
      return rowDataTyped.car ? (
        <div
          className="overflow-hidden"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: "1 1 auto",
            gap: "4px",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {rowDataTyped.car?.make === "Ford" ? (
            "Another FORD classic"
          ) : (
            <>
              <span>{rowDataTyped.car.make}</span>
              <span>{rowDataTyped.car.model}</span>
              <span>{rowDataTyped.car.fuel}</span>
            </>
          )}
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
    name: "tags",
    label: "Tags",
    searchFn: (rd, searchText) => {
      const rowData = rd as RowData;
      return ((rowData.tags as string[]) ?? []).some((tag) =>
        tag.toLowerCase().includes(searchText.toLowerCase().trim()),
      );
    },
    width: "160px",
    canColumnFilter: true,
    renderFn: ({ rowData: rd }) => {
      const rowData = rd as RowData;
      const tags = rowData.tags as string[] | undefined;
      if (!tags || tags.length === 0) {
        return <div>No tags</div>;
      }
      return (
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            overflow: "hidden",
            maxWidth: "100%",
          }}
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
  {
    name: "desires",
    label: "Desires",
    renderFn: ({ rowData: rd }) => {
      const rowData = rd as RowData;
      const desires = rowData.desires as { type: string; value: string }[] | undefined;
      if (!desires || desires.length === 0) {
        return <div>No desires</div>;
      } else {
        return (
          <div
            style={{
              display: "flex",
              gap: "4px",
              flexDirection: "column",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            {desires.map((desire, index) => (
              <span
                key={index}
                style={{ border: "1px solid #ccc", padding: "2px 4px", borderRadius: "4px" }}
              >
                {desire.type}: {desire.value}
              </span>
            ))}
          </div>
        );
      }
    },
    canColumnFilter: true,
    columnFilterValueFn: (dataItem) => {
      const item = dataItem as RowData["desires"];
      return item.map((desire) => desire.value) ?? [""];
    },
  },
];

const getSeededOffsetDays = (seed: string): number => {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 365;
  }
  return hash;
};

const getDateOfBirth = (age: string, seed: string): Date => {
  const dateOfBirth = new Date();
  dateOfBirth.setFullYear(dateOfBirth.getFullYear() - Number(age));
  dateOfBirth.setDate(dateOfBirth.getDate() - getSeededOffsetDays(seed));
  return dateOfBirth;
};

export interface RowData extends Record<string, unknown> {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  dob: Date;
  car: {
    make: string;
    model: string;
    fuel: string;
  } | null;
  tags: string[];
  desires: { type: string; value: string }[];
}

export const mockData = raw_data.map((item) => ({
  id: item.id,
  first_name: item.first_name,
  last_name: item.last_name,
  age: Number(item.age),
  dob: getDateOfBirth(item.age, item.id),
  car:
    Number(item.age) < 21 || Number(item.age) > 55
      ? null
      : {
          make: item.car_make,
          model: item.car_model,
          fuel: item.car_fuel,
        },
  tags: [item.verb, item.verb2],
  desires: [
    { type: "Car", value: item.car },
    { type: "Genre", value: item.genre },
    { type: "Animal", value: item.animal },
  ].slice(Math.floor(Math.random() * 3), 3), // Randomly select 0 to 2 desires
}));
