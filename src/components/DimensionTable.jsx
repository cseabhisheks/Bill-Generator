import { useState } from "react";
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
  showPreview = false,
}) {
  const tableArea = calculateTotal(rows);
  const tableAmount = rateEnabled
    ? calculateTotalAmount(rows)
    : calculateCommonRateAmount(rows, commonRate);
  const [showSummary, setShowSummary] = useState(showPreview);

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

        {!rateEnabled && showCommonRateInput && (
          <div className="dimension-common-rate-panel no-print">
            <span className="dimension-common-rate-label">Common Rate</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="dimension-common-rate-input"
              value={commonRate}
              onChange={(event) => setCommonRate(event.target.value)}
              placeholder="₹ / sq.ft."
            />
          </div>
        )}
      </div>

      {(tableTitle || "") && (
        <div className="print-table-title-bar">
          <span className="print-table-title-text">{tableTitle}</span>
        </div>
      )}

      <div className="dimension-table-body">
        <div className="dimension-table-scroll">
          <table className="dimension-table-content table-auto border-collapse text-sm">
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
                Area (Sq. Ft.)
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
        </div>

      </div>

      {!showPreview && (
        <div className="no-print table-summary-toggle-row">
          <button
            type="button"
            className="table-summary-toggle"
            onClick={() => setShowSummary((value) => !value)}
          >
            {showSummary ? "Hide Totals" : "Show Totals"}
          </button>
        </div>
      )}

      {(showPreview || showSummary) && (
        <div className="print-table-total-summary">
          <div className="print-table-total-summary-card">
            {!rateEnabled && (
              <div className="print-table-total-summary-item">
                <span className="print-table-total-label">Total Area</span>
                <span className="print-table-total-value">{tableArea.toFixed(2)} sq. ft.</span>
              </div>
            )}
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
      )}
    </div>
  );
}