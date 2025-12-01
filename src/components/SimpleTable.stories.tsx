import type { Meta, StoryObj } from "@storybook/react-vite";
import { Key, useState } from "react";
import { mockData } from "../../__dummy__/mock_data";
import { mockFields } from "../../__dummy__/mock_fields";
import { ISimpleTableRow, SimpleTable } from "../components";

const meta: Meta<typeof SimpleTable> = {
  title: "Components/SimpleTable",
  component: SimpleTable,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    id: { control: "text", description: "Unique identifier for the table" },
    headerLabel: { control: "text", description: "Title displayed in the header" },
    searchLabel: { control: "text", description: "Label for the search input" },
    filterLabel: { control: "text", description: "Label for the filter checkbox" },
    showHeader: { control: "boolean", description: "Show/hide the header row" },
    showSearch: { control: "boolean", description: "Show/hide the search input" },
    showFilter: { control: "boolean", description: "Show/hide the filter checkbox" },
    showPager: { control: "boolean", description: "Show/hide the pagination controls" },
    selectable: { control: "boolean", description: "Enable row selection" },
    headerBackgroundColor: { control: "color", description: "Background color for header" },
    selectedBackgroundColor: {
      control: "color",
      description: "Background color for selected rows",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SimpleTable>;

// Basic SimpleTable with minimal configuration
export const Basic: Story = {
  args: {
    id: "basic-table",
    fields: mockFields,
    keyField: "id",
    data: mockData.slice(0, 25),
    headerLabel: "Basic Table",
  },
};

// SimpleTable with all features enabled
export const FullFeatured: Story = {
  args: {
    id: "full-featured-table",
    fields: mockFields,
    keyField: "id",
    data: mockData.slice(0, 100),
    headerLabel: "Full Featured Table",
    searchLabel: "Search",
    filterLabel: "Cars only",
    showHeader: true,
    showSearch: true,
    showFilter: true,
    showPager: true,
  },
};

// SimpleTable without header
export const NoHeader: Story = {
  args: {
    id: "no-header-table",
    fields: mockFields,
    keyField: "id",
    data: mockData.slice(0, 25),
    showHeader: false,
  },
};

// SimpleTable without search
export const NoSearch: Story = {
  args: {
    id: "no-search-table",
    fields: mockFields,
    keyField: "id",
    data: mockData.slice(0, 25),
    headerLabel: "No Search",
    showSearch: false,
    showFilter: true,
  },
};

// SimpleTable without filter
export const NoFilter: Story = {
  args: {
    id: "no-filter-table",
    fields: mockFields,
    keyField: "id",
    data: mockData.slice(0, 25),
    headerLabel: "No Filter",
    showSearch: true,
    showFilter: false,
  },
};

// SimpleTable without pager (shows all rows)
export const NoPager: Story = {
  args: {
    id: "no-pager-table",
    fields: mockFields,
    keyField: "id",
    data: mockData.slice(0, 50),
    headerLabel: "No Pager",
    showPager: false,
  },
};

// Interactive story with row selection
const InteractiveTableWithSelection = () => {
  const [data, setData] = useState<ISimpleTableRow[]>(
    mockData.slice(0, 100).map((r) => ({ ...r, selected: "No" })),
  );
  const [selected, setSelected] = useState<Key[]>([]);
  const [receivedWidths, setReceivedWidths] = useState<{ name: string; width: string }[]>([]);

  return (
    <div style={{ padding: "1rem", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => {
            setData(data.filter((r) => !selected.includes(r.id as Key)));
            setSelected([]);
          }}
          style={{ marginRight: "0.5rem" }}
        >
          Remove selected ({selected.length})
        </button>
        <button
          onClick={() => {
            setData(mockData.slice(0, 100).map((r) => ({ ...r, selected: "No" })));
            setSelected([]);
          }}
        >
          Reset
        </button>
        {receivedWidths.length > 0 && (
          <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
            Column widths: {receivedWidths.map((w) => `${w.name}:${w.width}`).join(" | ")}
          </div>
        )}
      </div>
      <div style={{ flex: 1, backgroundColor: "cyan", padding: "1rem" }}>
        <SimpleTable
          id="interactive-table"
          fields={[{ name: "selected", label: "Sel" }, ...mockFields]}
          keyField="id"
          data={data}
          headerLabel="Interactive Table"
          searchLabel="Search..."
          filterLabel="Cars only"
          showHeader={true}
          showSearch={true}
          showFilter={true}
          showPager={true}
          selectable
          currentSelection={selected}
          setCurrentSelection={(ret) => {
            setSelected(ret);
            const newData = data.map((r) => ({
              ...r,
              selected: ret.includes(r.id as Key) ? "Yes" : "No",
            }));
            setData(newData);
          }}
          onWidthChange={(ret) => setReceivedWidths(ret)}
          selectedBackgroundColor="rgb(0,0,0,0.1)"
        />
      </div>
    </div>
  );
};

export const InteractiveWithSelection: Story = {
  render: () => <InteractiveTableWithSelection />,
  parameters: {
    docs: {
      description: {
        story:
          "An interactive table with row selection. Select rows using the checkboxes, then use the buttons to remove selected rows or reset the data.",
      },
    },
  },
};

// Story with custom styling
export const CustomStyling: Story = {
  args: {
    id: "custom-styled-table",
    fields: mockFields,
    keyField: "id",
    data: mockData.slice(0, 25),
    headerLabel: "Custom Styled Table",
    headerBackgroundColor: "#1a1a2e",
    selectedBackgroundColor: "rgba(255, 107, 107, 0.3)",
    selectActiveColor: "#ff6b6b",
    selectInactiveColor: "#ccc",
  },
};

// Story showing large dataset with pagination
export const LargeDataset: Story = {
  args: {
    id: "large-dataset-table",
    fields: mockFields,
    keyField: "id",
    data: mockData,
    headerLabel: "Large Dataset (1000 rows)",
    showPager: true,
  },
};

// Story with minimal fields
const minimalFields = [
  { name: "id", hidden: true },
  { name: "first_name", label: "First Name" },
  { name: "last_name", label: "Last Name" },
];

export const MinimalFields: Story = {
  args: {
    id: "minimal-fields-table",
    fields: minimalFields,
    keyField: "id",
    data: mockData.slice(0, 25),
    headerLabel: "Minimal Fields",
  },
};
