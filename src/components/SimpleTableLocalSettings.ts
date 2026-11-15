interface LegacySimpleTableLocalSettings extends Omit<SimpleTableLocalSettings, "headerWidths"> {
  headerWidths?: (string | null | undefined)[];
}

type SimpleTableLocalSettingsInput = SimpleTableLocalSettings | LegacySimpleTableLocalSettings;

export interface SimpleTableLocalSettings {
  pageRows?: number | string;
  headerWidths?: { name: string; width: string }[];
  sortBy?: { name: string; asc: boolean } | null;
  filterData?: boolean;
  searchText?: string;
  currentColumnFilters?: { columnName: string; values: string[] }[];
}

const isNamedHeaderWidths = (
  headerWidths: unknown[],
): headerWidths is { name: string; width: string }[] =>
  headerWidths.every((width) => {
    if (typeof width !== "object" || width === null || Array.isArray(width)) return false;
    const columnWidth = width as Record<string, unknown>;
    return typeof columnWidth.name === "string" && typeof columnWidth.width === "string";
  });

const isLegacyHeaderWidths = (
  headerWidths: unknown[],
): headerWidths is (string | null | undefined)[] =>
  headerWidths.every((width) => typeof width === "string" || width === null || width === undefined);

/** Validates settings loaded from either the legacy or current local-storage format. */
export const isSimpleTableLocalSettings = (obj: unknown): obj is SimpleTableLocalSettingsInput => {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return false;
  const settings = obj as Record<string, unknown>;
  if (settings.pageRows !== undefined) {
    if (typeof settings.pageRows !== "number" && typeof settings.pageRows !== "string")
      return false;
  }
  if (settings.headerWidths !== undefined) {
    if (
      !Array.isArray(settings.headerWidths) ||
      (!isNamedHeaderWidths(settings.headerWidths) && !isLegacyHeaderWidths(settings.headerWidths))
    )
      return false;
  }
  if (settings.sortBy !== undefined && settings.sortBy !== null) {
    if (typeof settings.sortBy !== "object" || Array.isArray(settings.sortBy)) return false;
    const sortBy = settings.sortBy as Record<string, unknown>;
    if (typeof sortBy.name !== "string" || typeof sortBy.asc !== "boolean") return false;
  }
  if (settings.filterData !== undefined && typeof settings.filterData !== "boolean") return false;
  if (settings.searchText !== undefined && typeof settings.searchText !== "string") return false;
  if (
    settings.currentColumnFilters !== undefined &&
    (!Array.isArray(settings.currentColumnFilters) ||
      !settings.currentColumnFilters.every((filter) => {
        if (typeof filter !== "object" || filter === null || Array.isArray(filter)) return false;
        const columnFilter = filter as Record<string, unknown>;
        return (
          typeof columnFilter.columnName === "string" &&
          Array.isArray(columnFilter.values) &&
          columnFilter.values.every((value) => typeof value === "string")
        );
      }))
  )
    return false;
  return true;
};

/** Converts accepted legacy width arrays to the current named-column format. */
export const resolveSimpleTableLocalSettings = (
  obj: unknown,
  visibleFieldNames: string[],
): SimpleTableLocalSettings | null => {
  if (!isSimpleTableLocalSettings(obj)) return null;
  if (obj.headerWidths === undefined) return { ...obj, headerWidths: undefined };
  if (isNamedHeaderWidths(obj.headerWidths)) return { ...obj, headerWidths: obj.headerWidths };

  return {
    ...obj,
    headerWidths: obj.headerWidths.flatMap((width, index) =>
      typeof width === "string" && visibleFieldNames[index] !== undefined
        ? [{ name: visibleFieldNames[index], width }]
        : [],
    ),
  };
};
