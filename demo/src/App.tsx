import { Key, useState } from "react";
import { mockData } from "../../src/__dummy__/mock_data";
import { mock_fields } from "../../src/__dummy__/mock_fields";
import { SimpleTable, ISimpleTableRow } from "../../src/components";

// Main application
const App = (): JSX.Element => {
  const [data, setData] = useState<ISimpleTableRow[]>(mockData);
  const [selected, setSelected] = useState<Key[]>([]);
  const [height, setHeight] = useState<string>("600px");
  const [width, setWidth] = useState<string>("600px");
  const [title, setTitle] = useState<string>("");
  const [receivedWidths, setReceivedWidths] = useState<(string | undefined)[]>([]);
  const [showHeader, setShowTitle] = useState<boolean>(true);
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showPager, setShowPager] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(true);

  return (
    <div className="app-holder">
      <div className="app-border">
        <div className="app-inner">
          <div>
            <table>
              <tbody>
                <tr>
                  <td draggable>Height</td>
                  <td>
                    <input
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(e.currentTarget.value)}
                    />
                  </td>
                  <td>Width</td>
                  <td>
                    <input
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(e.currentTarget.value)}
                    />
                  </td>
                  <td>
                    Title:{" "}
                    <input
                      id="show-title"
                      type="checkbox"
                      checked={showHeader}
                      onChange={() => setShowTitle(!showHeader)}
                    />
                    &nbsp;&nbsp;&nbsp; Search:{" "}
                    <input
                      id="show-search"
                      type="checkbox"
                      checked={showSearch}
                      onChange={() => setShowSearch(!showSearch)}
                    />
                    &nbsp;&nbsp;&nbsp; Filter:{" "}
                    <input
                      id="show-filter"
                      type="checkbox"
                      checked={showFilter}
                      onChange={() => setShowFilter(!showFilter)}
                    />
                    &nbsp;&nbsp;&nbsp; Pager:{" "}
                    <input
                      id="show-pager"
                      type="checkbox"
                      checked={showPager}
                      onChange={() => setShowPager(!showPager)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Title</td>
                  <td>
                    <input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.currentTarget.value)}
                    />
                  </td>
                  <td>&nbsp;</td>
                  <td>
                    <button
                      onClick={() => {
                        setData(data.filter((r) => !selected.includes(r.id as Key)));
                      }}
                    >
                      Remove selected
                    </button>
                  </td>
                  <td>Widths: {receivedWidths.join(".")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className="table-holder"
            style={{ backgroundColor: "cyan", height, width, maxWidth: "800px", padding: "1rem" }}
          >
            <SimpleTable
              id="ais"
              fields={mock_fields}
              keyField={"id"}
              data={data}
              headerLabel={title}
              showHeader={showHeader}
              showSearch={showSearch}
              showFilter={showFilter}
              showPager={showPager}
              filterLabel="Cars only"
              selectable
              currentSelection={selected}
              setCurrentSelection={setSelected}
              onWidthChange={(ret) => setReceivedWidths(ret)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
