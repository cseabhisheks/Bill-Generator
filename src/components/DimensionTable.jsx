import DimensionRow from "./DimensionRow";
import {
  calculateTotal,
  calculateTotalAmount,
  calculateCommonRateAmount,
} from "../utils/areaCalculator";

const formatCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function DimensionTable({
  rows,
  updateRow,
  removeRow,
  descriptionEnabled,
  rateEnabled,
  commonRate,
  setCommonRate,
  showCommonRateInput = false,
  tableTitle = "",
  setTableTitle,
}) {
  const tableArea = calculateTotal(rows);
  const tableAmount = rateEnabled
    ? calculateTotalAmount(rows)
    : calculateCommonRateAmount(rows, commonRate);

  return (
    <div className="dimension-table-wrapper">
      <div className="table-title-editor no-print">
        <label className="table-title-editor-label">Table Header</label>
        <input
          type="text"
          className="table-title-editor-input"
          value={tableTitle}
          onChange={(event) => setTableTitle?.(event.target.value)}
          placeholder="e.g. Kitchen Work"
        />
      </div>

      {(tableTitle || "") && (
        <div className="print-table-title-bar">
          <span className="print-table-title-text">{tableTitle}</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-start gap-3">
            <table className="w-max table-auto border-collapse text-sm">
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
                    updateRow={(rowIndex, field, value) => updateRow(rowIndex, field, value)}
                    removeRow={(rowIndex) => removeRow(rowIndex)}
                    descriptionEnabled={descriptionEnabled}
                    rateEnabled={rateEnabled}
                  />
                ))}
              </tbody>
            </table>

            {!rateEnabled && showCommonRateInput && (
              <div className="no-print flex shrink-0 items-center self-stretch gap-2 rounded border border-gray-300 bg-white px-3 py-2">
                <span className="text-sm font-medium text-gray-700">Common Rate</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-36 rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-800"
                  value={commonRate}
                  onChange={(event) => setCommonRate(event.target.value)}
                  placeholder="₹ / sq.ft."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="print-table-total-summary">
        <div className="print-table-total-summary-card">
          <div className="print-table-total-summary-item">
            <span className="print-table-total-label">Total Area</span>
            <span className="print-table-total-value">{tableArea.toFixed(2)} sq. ft.</span>
          </div>
          {!rateEnabled && (
            <div className="print-table-total-summary-item">
              <span className="print-table-total-label">Rate</span>
              <span className="print-table-total-value">{formatCurrency.format(Number(commonRate || 0))} / sq. ft.</span>
            </div>
          )}
          <div className="print-table-total-summary-item">
            <span className="print-table-total-label">Amount</span>
            <span className="print-table-total-value">{formatCurrency.format(tableAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}