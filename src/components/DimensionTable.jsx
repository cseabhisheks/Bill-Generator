import DimensionRow from "./DimensionRow";

export default function DimensionTable({
  rows,
  updateRow,
  removeRow,
  descriptionEnabled,
  rateEnabled,
}) {
  return (
    <div className=" w-full overflow-x-auto">
      <table className="w-max  table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-center text-xs font-semibold text-gray-700">

            <th rowSpan="2" className="border border-gray-300 px-1 py-1">
              S.No
            </th>

            {descriptionEnabled && (
              <th rowSpan="2" className="border border-gray-300 px-1 py-1">
                Description
              </th>
            )}

            <th colSpan="2" className="border border-gray-300 px-1 py-1">
              Length
            </th>

            <th colSpan="2" className="border border-gray-300 px-1 py-1">
              Width
            </th>

            <th rowSpan="2" className="border border-gray-300 px-1 py-1">
              Sq. Ft.
            </th>

            {rateEnabled && (
              <>
                <th rowSpan="2" className="border border-gray-300 px-1 py-1">
                  Rate
                </th>

                <th rowSpan="2" className="border border-gray-300 px-1 py-1">
                  Amount
                </th>
              </>
            )}

            <th
              rowSpan="2"
              className="no-print border border-gray-300 px-1 py-1"
            >
              Delete
            </th>

          </tr>

          <tr className="bg-gray-50 text-center text-[11px] text-gray-500">
            <th className="border border-gray-300 px-1 py-1">Ft</th>
            <th className="border border-gray-300 px-1 py-1">In</th>
            <th className="border border-gray-300 px-1 py-1">Ft</th>
            <th className="border border-gray-300 px-1 py-1">In</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <DimensionRow
              key={index}
              row={row}
              index={index}
              updateRow={updateRow}
              removeRow={removeRow}
              descriptionEnabled={descriptionEnabled}
              rateEnabled={rateEnabled}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
}