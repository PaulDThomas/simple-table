export const SimpleTableColumnFilter = ({ columnName }: { columnName: string }) => (
  <>
    <table className="columnfilter-table">
      <thead>
        <tr>
          <td>Column filter for {columnName}</td>
        </tr>
      </thead>
    </table>
  </>
);
