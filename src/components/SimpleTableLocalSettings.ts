export interface SimpleTableLocalSettings {
  pageRows?: number | string;
  headerWidths?: (string | undefined)[] | { name: string; width: string }[];
  sortBy?: { name: string; asc: boolean } | null;
  filterData?: boolean;
  searchText?: string;
  currentColumnFilters?: { columnName: string; values: string[] }[];
}

// Type guard for SimpleTableLocalSettings
export const isSimpleTableLocalSettings = (obj: unknown): obj is SimpleTableLocalSettings => {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return false;
  const settings = obj as Record<string, unknown>;
  if (settings.pageRows !== undefined) {
    if (typeof settings.pageRows !== "number" && typeof settings.pageRows !== "string")
      return false;
  }
  if (settings.headerWidths !== undefined) {
    if (!Array.isArray(settings.headerWidths)) return false;
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
